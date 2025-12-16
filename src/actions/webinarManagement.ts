'use server'

import { prismaClient } from '@/lib/prismaClient'
import { WebinarStatusEnum } from '@prisma/client'
import { zoomClient } from '@/lib/zoom/client'

/**
 * Check and update webinars that should have ended but are still in LIVE/WAITING_ROOM status
 * This handles webinars that were created before the automatic end timer was implemented
 */
export async function checkAndUpdateExpiredWebinars() {
  try {
    const now = new Date()

    // Find webinars that are LIVE or WAITING_ROOM but their end time has passed
    const expiredWebinars = await prismaClient.webinar.findMany({
      where: {
        // Only auto-end non-Zoom webinars; Zoom webinars rely on Zoom webhooks
        zoomWebinarId: null,
        OR: [
          { webinarStatus: WebinarStatusEnum.LIVE },
          { webinarStatus: WebinarStatusEnum.WAITING_ROOM },
        ],
      },
    })

    const updatedCount = { total: 0, ended: 0 }

    for (const webinar of expiredWebinars) {
      const startTime = new Date(webinar.startTime)
      const endTime = new Date(startTime.getTime() + webinar.duration * 60000)

      // If the webinar should have ended, update its status
      if (endTime < now) {
        await prismaClient.webinar.update({
          where: { id: webinar.id },
          data: { webinarStatus: WebinarStatusEnum.ENDED },
        })
        updatedCount.ended++
      }

      updatedCount.total++
    }

    console.log(`Checked ${updatedCount.total} webinars, marked ${updatedCount.ended} as ended`)

    // Also sync Zoom-integrated webinars that were deleted directly in Zoom
    await syncZoomDeletedWebinars()

    return {
      success: true,
      checked: updatedCount.total,
      updated: updatedCount.ended,
    }
  } catch (error) {
    console.error('Error checking expired webinars:', error)
    return {
      success: false,
      error: 'Failed to check expired webinars',
    }
  }
}

/**
 * Update or delete a webinar
 */
export async function updateWebinar(
  webinarId: string,
  data: {
    title?: string
    description?: string
    startTime?: Date
    duration?: number
    tags?: string[]
    ctaLabel?: string
    ctaType?: 'BOOK_A_CALL' | 'BUY_NOW'
    aiAgentId?: string | null
    priceId?: string | null
    lockChat?: boolean
    couponCode?: string | null
    couponEnabled?: boolean
  }
) {
  try {
    // Get the webinar to check if it has Zoom integration
    const webinar = await prismaClient.webinar.findUnique({
      where: { id: webinarId },
    })

    if (!webinar) {
      return { status: 404, message: 'Webinar not found' }
    }

    // Update the webinar in our database
    const updatedWebinar = await prismaClient.webinar.update({
      where: { id: webinarId },
      data,
    })

    // If Zoom integration is enabled and key fields changed, update the underlying Zoom MEETING directly
    if (webinar.zoomWebinarId && (data.startTime || data.duration || data.title || data.description)) {
      try {
        const zoomUpdateData: any = {}

        if (data.title) zoomUpdateData.topic = data.title
        if (data.description) zoomUpdateData.agenda = data.description
        if (data.startTime) zoomUpdateData.start_time = data.startTime.toISOString()
        if (data.duration) zoomUpdateData.duration = data.duration

        // We create Zoom MEETINGS in this flow, so update via the meetings API
        await zoomClient.updateMeeting(webinar.zoomWebinarId, zoomUpdateData)
      } catch (zoomError) {
        console.error('Error updating Zoom meeting:', zoomError)
        // Continue even if Zoom update fails
      }
    }

    return {
      status: 200,
      message: 'Webinar updated successfully',
      webinar: updatedWebinar,
    }
  } catch (error) {
    console.error('Error updating webinar:', error)
    return {
      status: 500,
      message: 'Failed to update webinar',
    }
  }
}

/**
 * Delete a webinar
 */
export async function deleteWebinar(webinarId: string) {
  try {
    const webinar = await prismaClient.webinar.findUnique({
      where: { id: webinarId },
    })

    if (!webinar) {
      return { status: 404, message: 'Webinar not found' }
    }

    // Delete from Zoom if integrated
    if (webinar.zoomWebinarId) {
      try {
        // We create Zoom MEETINGS, so delete via the meetings API
        await zoomClient.deleteMeeting(webinar.zoomWebinarId)
      } catch (zoomError) {
        console.error('Error deleting Zoom meeting:', zoomError)
        // Continue with database deletion
      }
    }

    // Delete from database
    await prismaClient.webinar.delete({
      where: { id: webinarId },
    })

    return {
      status: 200,
      message: 'Webinar deleted successfully',
    }
  } catch (error) {
    console.error('Error deleting webinar:', error)
    return {
      status: 500,
      message: 'Failed to delete webinar',
    }
  }
}

/**
 * Cancel a webinar
 * - Marks it as CANCELLED in our database (kept for history/resources)
 * - Deletes the underlying Zoom meeting if one exists
 */
export async function cancelWebinar(webinarId: string) {
  try {
    const webinar = await prismaClient.webinar.findUnique({
      where: { id: webinarId },
    })

    if (!webinar) {
      return { status: 404, message: 'Webinar not found' }
    }

    // Update status to CANCELLED locally
    const updatedWebinar = await prismaClient.webinar.update({
      where: { id: webinarId },
      data: { webinarStatus: WebinarStatusEnum.CANCELLED },
    })

    // Delete the Zoom meeting so it no longer appears in Zoom
    // (we only create Zoom MEETINGS in this flow)
    if (webinar.zoomWebinarId) {
      try {
        await zoomClient.deleteMeeting(webinar.zoomWebinarId)
      } catch (zoomError) {
        console.error('Error deleting Zoom meeting while cancelling:', zoomError)
        // We keep the local cancellation even if Zoom deletion fails
      }
    }

    return {
      status: 200,
      message: 'Webinar cancelled successfully',
      webinar: updatedWebinar,
    }
  } catch (error) {
    console.error('Error cancelling webinar:', error)
    return {
      status: 500,
      message: 'Failed to cancel webinar',
    }
  }
}

/**
 * Sync Zoom deletions for Zoom-integrated webinars.
 * If a Zoom meeting no longer exists (deleted directly in Zoom),
 * mark the corresponding webinar as CANCELLED locally so it
 * disappears from attendee-facing lists.
 */
async function syncZoomDeletedWebinars() {
  try {
    const zoomWebinars = await prismaClient.webinar.findMany({
      where: {
        zoomWebinarId: { not: null },
        webinarStatus: {
          in: [
            WebinarStatusEnum.SCHEDULED,
            WebinarStatusEnum.WAITING_ROOM,
            WebinarStatusEnum.LIVE,
          ],
        },
      },
      select: {
        id: true,
        zoomWebinarId: true,
      },
    })

    for (const webinar of zoomWebinars) {
      if (!webinar.zoomWebinarId) continue

      try {
        // If the meeting exists, this call will succeed and we do nothing
        await zoomClient.getMeeting(webinar.zoomWebinarId)
      } catch (error: any) {
        const message = error?.message || ''

        // Zoom returns messages like "Meeting does not exist" when deleted
        const isNotFound =
          message.toLowerCase().includes('does not exist') ||
          message.toLowerCase().includes('not found')

        if (isNotFound) {
          await prismaClient.webinar.update({
            where: { id: webinar.id },
            data: { webinarStatus: WebinarStatusEnum.CANCELLED },
          })
        } else {
          console.error('Error checking Zoom meeting status:', error)
        }
      }
    }
  } catch (error) {
    console.error('Error syncing Zoom-deleted webinars:', error)
  }
}

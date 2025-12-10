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

    // If Zoom integration is enabled and time/duration changed, update Zoom
    if (webinar.zoomWebinarId && (data.startTime || data.duration || data.title || data.description)) {
      try {
        const zoomUpdateData: any = {}
        
        if (data.title) zoomUpdateData.topic = data.title
        if (data.description) zoomUpdateData.agenda = data.description
        if (data.startTime) zoomUpdateData.start_time = data.startTime.toISOString()
        if (data.duration) zoomUpdateData.duration = data.duration

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/zoom/webinar/${webinar.zoomWebinarId}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(zoomUpdateData),
          }
        )

        if (!response.ok) {
          console.error('Failed to update Zoom webinar:', await response.text())
        }
      } catch (zoomError) {
        console.error('Error updating Zoom webinar:', zoomError)
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
 * Cancel a webinar (keeps it in database but marks as cancelled)
 */
export async function cancelWebinar(webinarId: string) {
  try {
    const webinar = await prismaClient.webinar.findUnique({
      where: { id: webinarId },
    })

    if (!webinar) {
      return { status: 404, message: 'Webinar not found' }
    }

    // Update status to CANCELLED
    const updatedWebinar = await prismaClient.webinar.update({
      where: { id: webinarId },
      data: { webinarStatus: WebinarStatusEnum.CANCELLED },
    })

    // Optionally cancel in Zoom (or keep it there with a note)
    if (webinar.zoomWebinarId) {
      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/zoom/webinar/${webinar.zoomWebinarId}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              topic: `[CANCELLED] ${webinar.title}`,
            }),
          }
        )
      } catch (zoomError) {
        console.error('Error updating Zoom webinar:', zoomError)
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

'use server'

import { WebinarFormState } from '@/store/useWebinarStore'
import { onAuthenticateUser } from './auth'
import { prismaClient } from '@/lib/prismaClient'
import { revalidatePath } from 'next/cache'
import { WebinarStatusEnum } from '@prisma/client'

function combineDateTime(
  date: Date,
  timeStr: string,
  timeFormat: 'AM' | 'PM'
): Date {
  const [hoursStr, minutesStr] = timeStr.split(':')
  let hours = parseInt(hoursStr, 10)
  const minutes = parseInt(minutesStr || '0', 10)

  // Convert to 24-hour format
  if (timeFormat === 'PM' && hours < 12) {
    hours += 12
  } else if (timeFormat === 'AM' && hours === 12) {
    hours = 0
  }

  const result = new Date(date)
  result.setHours(hours, minutes, 0, 0)
  return result
}
export const createWebinar = async (formData: WebinarFormState) => {
  try {
    const user = await onAuthenticateUser()
    if (!user.user) {
      return { status: 401, message: 'Unauthorized' }
    }
    const presenterId=user.user.id
    console.log('Form Data:', formData, presenterId)

    if (!formData.basicInfo.webinarName) {
    return { status: 404, message: 'Webinar name is required' }
    }

    if (!formData.basicInfo.date) {
    return { status: 404, message: 'Webinar date is required' }
    }

    if (!formData.basicInfo.time) {
    return { status: 404, message: 'Webinar time is required' }
    }

    const combinedDateTime = formData.basicInfo.dateTime
      ? new Date(formData.basicInfo.dateTime)
      : combineDateTime(
          formData.basicInfo.date,
          formData.basicInfo.time,
          formData.basicInfo.timeFormat || 'AM'
        )

    // Create Zoom meeting if enabled
    let zoomWebinarData = null
    if (formData.additionalInfo?.enableZoom) {
      try {
        // Import Zoom client directly to avoid HTTP fetch issues
        const { zoomClient } = await import('@/lib/zoom/client')

        // Prefer the client's timezone captured in the form; fall back to server timezone
        const timezone =
          formData.basicInfo.timeZone ||
          Intl.DateTimeFormat().resolvedOptions().timeZone ||
          'UTC'

        console.log('Creating Zoom meeting with timezone:', timezone, {
          rawFormTimeZone: formData.basicInfo.timeZone,
          startTime: combinedDateTime.toISOString(),
        })

        // Create Zoom meeting (works with Free/Pro accounts)
        const zoomMeeting = await zoomClient.createMeeting({
          topic: formData.basicInfo.webinarName,
          type: 2, // Scheduled meeting
          start_time: combinedDateTime.toISOString(),
          duration: formData.basicInfo.duration || 60,
          timezone: timezone,
          agenda: formData.basicInfo.description || '',
          settings: {
            host_video: true,
            participant_video: true,
            join_before_host: true, // Allow participants to join without host login
            mute_upon_entry: false,
            waiting_room: false, // Disable waiting room for instant access
            audio: 'both',
            auto_recording: 'cloud',
            approval_type: 0, // Auto-approve
          },
        })

        zoomWebinarData = {
          zoomWebinarId: zoomMeeting.id.toString(),
          zoomJoinUrl: zoomMeeting.join_url,
          zoomRegistrationUrl: null, // Meetings don't have registration URLs
          zoomPassword: zoomMeeting.password || null,
        }
        
        console.log('✅ Zoom meeting created:', zoomMeeting.id, zoomMeeting.join_url)
      } catch (zoomError: any) {
        console.error('❌ Error creating Zoom meeting:', zoomError?.message)
        if (zoomError?.response) {
          console.error('Zoom API error status:', zoomError.response.status)
          console.error('Zoom API error data:', JSON.stringify(zoomError.response.data))
        }
        // Continue without Zoom integration
      }
    }

    const webinar = await prismaClient.webinar.create({
    data: {
        title: formData.basicInfo.webinarName,
        description: formData.basicInfo.description || '',
        startTime: combinedDateTime,
        duration: formData.basicInfo.duration || 60,
        tags: formData.cta.tags || [],
        ctaLabel: formData.cta.ctaLabel,
        ctaType: formData.cta.ctaType || 'BOOK_A_CALL',
        aiAgentId: formData.cta.aiAgent || null,
        priceId: formData.cta.priceId || null,
        lockChat: formData.additionalInfo.lockChat || false,
        couponCode: formData.additionalInfo.couponEnabled
        ? formData.additionalInfo.couponCode
        : null,
        couponEnabled: formData.additionalInfo.couponEnabled || false,
        videoUrl: formData.basicInfo.videoUrl || null,
        isPreRecorded: !!formData.basicInfo.videoUrl,
        thumbnail: formData.basicInfo.thumbnail || null,
        presenterId: presenterId,
        ...zoomWebinarData, // Include Zoom data if available
    },
    })

    // Create resources if any were uploaded
    if (formData.additionalInfo.resources && formData.additionalInfo.resources.length > 0) {
      await prismaClient.webinarResource.createMany({
        data: formData.additionalInfo.resources.map((resource: any) => ({
          webinarId: webinar.id,
          title: resource.title,
          description: resource.description || null,
          fileUrl: resource.fileUrl,
          fileName: resource.fileName,
          fileSize: resource.fileSize,
          fileType: resource.fileType,
        })),
      })
    }

    revalidatePath('/')
    return {
    status: 200,
    message: 'Webinar created successfully' + (zoomWebinarData ? ' with Zoom integration' : ''),
    webinarId: webinar.id,
    webinarLink: `/webinar/${webinar.id}`,
    zoomJoinUrl: zoomWebinarData?.zoomJoinUrl,
    }
    } catch (error) {
    console.error('Error creating webinar:', error)
    return {
    status: 500,
    message: 'Failed to create webinar. Please try again.',
    }
    }
}


export const getWebinarByPresenterId = async (presenterId: string) => {
  try {
    const webinars = await prismaClient.webinar.findMany({
      where: { presenterId },
      include: {
        presenter: {
          select:{
            name: true,
            stripeConnectId: true,
            id:true,
          },
        },
      },
    })
    return webinars
  } catch (error) {
    console.error('Error getting webinars:', error)
    return []
  }
}

export const getWebinarById = async (webinarId: string) => {
  try {
    const webinar = await prismaClient.webinar.findUnique({
      where: { id: webinarId },
      include: {
        presenter: {
          select: {
            id: true,
            name: true,
            profileImage: true,
            stripeConnectId: true,
          },
        },
      },
    });
    return webinar;
  } catch (error) {
    console.error('Error fetching webinar:', error);
    throw new Error('Failed to fetch webinar');
  }
};

export const changeWebinarStatus = async (
  webinarId: string,
  status: WebinarStatusEnum
) => {
  try {
    const webinar = await prismaClient.webinar.update({
      where: {
        id: webinarId,
      },
      data: {
        webinarStatus: status,
      },
    });
    return {
      status: 200,
      success: true,
      message: "Webinar status updated successfully",
      data: webinar,
    };
  } catch (error) {
    console.error("Error updating webinar status:", error);
    return {
      status: 500,
      success: false,
      message: "Failed to update webinar status. Please try again.",
    };
  }
};
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

    const combinedDateTime = combineDateTime(
    formData.basicInfo.date,
    formData.basicInfo.time,
    formData.basicInfo.timeFormat || 'AM'
    )
    const now = new Date()

    if (combinedDateTime < now) {
    return {
        status: 400,
        message: 'Webinar date and time cannot be in the past',
    }
    }

    // Create Zoom webinar if enabled
    let zoomWebinarData = null
    if (formData.additionalInfo?.enableZoom) {
      try {
        // Get the server's timezone (where webinar is being created from)
        // This ensures consistency across the system
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        
        const zoomResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/zoom/create-webinar`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            topic: formData.basicInfo.webinarName,
            startTime: combinedDateTime.toISOString(),
            duration: formData.basicInfo.duration || 60,
            timezone: timezone,
            agenda: formData.basicInfo.description || '',
          }),
        })

        if (zoomResponse.ok) {
          const zoomData = await zoomResponse.json()
          zoomWebinarData = {
            zoomWebinarId: zoomData.webinar.zoomId,
            zoomJoinUrl: zoomData.webinar.joinUrl,
            zoomRegistrationUrl: zoomData.webinar.registrationUrl,
          }
        } else {
          console.error('Failed to create Zoom webinar:', await zoomResponse.text())
        }
      } catch (zoomError) {
        console.error('Error creating Zoom webinar:', zoomError)
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
        presenterId: presenterId,
        ...zoomWebinarData, // Include Zoom data if available
    },
    })
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
'use server'

import React from "react"
import { prismaClient } from "@/lib/prismaClient"
import { AttendanceData } from "@/lib/type"
import { AttendedTypeEnum, CtaTypeEnum } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { resendClient, isEmailConfigured } from "@/lib/email"
import WebinarRegistrationConfirmation from "@/emails/WebinarRegistrationConfirmation"
import { formatInTimeZone } from "date-fns-tz"

const parseSeatsFromTags = (
  tags: string[] | null
): { remaining: number | null; total: number | null } => {
  if (!tags || tags.length === 0) {
    return { remaining: null, total: null }
  }

  const seatTag = tags.find((tag) => tag.startsWith("seats:"))
  if (!seatTag) {
    return { remaining: null, total: null }
  }

  const value = seatTag.replace("seats:", "").trim()
  const [remainingStr, totalStr] = value.split("/")

  const remaining = remainingStr ? Number.parseInt(remainingStr, 10) : NaN
  const total = totalStr ? Number.parseInt(totalStr, 10) : NaN

  if (!Number.isFinite(remaining) || !Number.isFinite(total)) {
    return { remaining: null, total: null }
  }

  return {
    remaining: Math.max(0, remaining),
    total: Math.max(0, total),
  }
}


export const getWebinarAttendance = async (
  webinarId: string,
  options: {
    includeUsers?: boolean
    userLimit?: number
  } = { includeUsers: true, userLimit: 100 }
) => {
  try {
    const webinar = await prismaClient.webinar.findUnique({
      where: { id: webinarId },
      select: {
        id: true,
        ctaType: true,
        tags: true,
        _count: {
          select: {
            attendances: true,
          },
        },
      },
    })
    if(!webinar){
        return{
            success: false,
            status: 400,
            error: 'Webinar not found',
        }
    }
    const attendanceCounts = await prismaClient.attendance.groupBy({
        by: ['attendedType'],
        where: {
            webinarId,
        },
        _count: {
            attendedType: true,
        },
        })

        const result: Record<AttendedTypeEnum, AttendanceData> = {} as Record<
        AttendedTypeEnum,
        AttendanceData
        >

        for (const type of Object.values(AttendedTypeEnum)) {
            if (
                type === AttendedTypeEnum.ADDED_TO_CART &&
                webinar.ctaType === CtaTypeEnum.BOOK_A_CALL
            ) {
                continue
            }

            if (
                type === AttendedTypeEnum.BREAKOUT_ROOM &&
                webinar.ctaType !== CtaTypeEnum.BOOK_A_CALL
            ) {
                continue
            }

            const countItem = attendanceCounts.find((item) => {
            if (
                webinar.ctaType === CtaTypeEnum.BOOK_A_CALL &&
                type === AttendedTypeEnum.BREAKOUT_ROOM &&
                item.attendedType === AttendedTypeEnum.ADDED_TO_CART
            ) {
                return true
            }
            return item.attendedType === type
            })

            result[type] = {
            count: countItem ? countItem._count.attendedType : 0,
            users: [],
            }
            }
            if (options.includeUsers) {
            for (const type of Object.values(AttendedTypeEnum)) {
                if (
                (type === AttendedTypeEnum.ADDED_TO_CART &&
                    webinar.ctaType === CtaTypeEnum.BOOK_A_CALL) ||
                (type === AttendedTypeEnum.BREAKOUT_ROOM &&
                    webinar.ctaType !== CtaTypeEnum.BOOK_A_CALL)
                ) {
                continue
                }

                const queryType =
                webinar.ctaType === CtaTypeEnum.BOOK_A_CALL &&
                type === AttendedTypeEnum.BREAKOUT_ROOM
                    ? AttendedTypeEnum.ADDED_TO_CART
                    : type
                if (result[type].count > 0) {
                const attendances = await prismaClient.attendance.findMany({
                    where: {
                    webinarId,
                    attendedType: queryType,
                    },
                    include: {
                    user: true,
                    },
                    take: options.userLimit, // Limit the number of users returned
                    orderBy: {
                    joinedAt: 'desc', // Most recent first
                    },
                })

                result[type].users = attendances.map((attendance) => ({
                id: attendance.user.id,
                name: attendance.user.name,
                email: attendance.user.email,
                phone: attendance.user.phone,
                businessName: attendance.user.businessName,
                description: attendance.user.description,
                createdAt: attendance.user.createdAt,
                updatedAt: attendance.user.updatedAt,
                callStatus: attendance.user.callStatus,
                }))
                }
                }
            }
                // revalidatePath(`/webinars/${webinarId}/pipelines`)
                return {
                success: true,
                data: result,
                ctaType: webinar.ctaType,
                webinarTags: webinar.tags || [],
                }
  } catch (error) {
    console.error('Failed to fetch attendance data:',error)
    return {
        success:false,
        error: 'Failed to fetch attendance data'
    }
  }
}


export const registerAttendee = async ({
  webinarId,
  email,
  name,
  phone,
  businessName,
  description,
  userId,
}: {
  webinarId: string;
  email: string;
  name: string;
  phone?: string;
  businessName?: string;
  description?: string;
  userId?: string;
}) => {
  try {
    if (!webinarId || !email || !name) {
      return {
        success: false,
        status: 400,
        message: 'Missing required parameters',
        data: null,
      };
    }

    const result = await prismaClient.$transaction(async (tx) => {
      const webinar = await tx.webinar.findUnique({
        where: { id: webinarId },
        select: {
          id: true,
          tags: true,
          zoomWebinarId: true,
          startTime: true,
          zoomJoinUrl: true,
          zoomPassword: true,
          title: true,
        },
      })

      if (!webinar) {
        return {
          success: false,
          status: 404,
          message: 'Webinar not found',
          data: null,
        } as const
      }

      // Find or create the attendee by email
      let attendee = await tx.attendee.findUnique({
        where: { email },
      })

      if (!attendee) {
        attendee = await tx.attendee.create({
          data: {
            email,
            name,
            phone: phone || null,
            businessName: businessName || null,
            description: description || null,
          },
        })
      }

      // Check for existing attendance first - do NOT adjust seats
      const existingAttendance = await tx.attendance.findFirst({
        where: {
          attendeeId: attendee.id,
          webinarId: webinarId,
        },
        include: {
          user: true,
        },
      })

      if (existingAttendance) {
        return {
          success: true,
          status: 200,
          data: existingAttendance,
          message: 'You are already registered for this webinar',
        } as const
      }

      // Handle seats logic via tags (seats:remaining/total) if configured
      const { remaining, total } = parseSeatsFromTags(webinar.tags || [])

      if (remaining !== null && total !== null) {
        if (remaining <= 0) {
          return {
            success: false,
            status: 409,
            message: 'This webinar is sold out.',
            data: null,
          } as const
        }

        const newRemaining = Math.max(0, remaining - 1)
        const existingTags = webinar.tags || []
        const filteredTags = existingTags.filter((tag) => !tag.startsWith('seats:'))
        const updatedTags = [...filteredTags, `seats:${newRemaining}/${total}`]

        await tx.webinar.update({
          where: { id: webinarId },
          data: {
            tags: updatedTags,
          },
        })
      }

      // Create attendance record
      const attendance = await tx.attendance.create({
        data: {
          attendedType: AttendedTypeEnum.REGISTERED,
          attendeeId: attendee.id,
          webinarId: webinarId,
          userId: userId || null,
        },
        include: {
          user: true,
        },
      })

      return {
        success: true,
        status: 200,
        data: attendance,
        zoomWebinarId: webinar.zoomWebinarId,
        webinarTitle: webinar.title,
        webinar,
        attendee,
        message: 'Successfully Registered',
      } as const
    })

    if (result.success) {
      revalidatePath(`/${webinarId}`)
    }

    // Send confirmation email to the registrant (non-blocking if email is not configured or fails)
    if (result.success && isEmailConfigured && resendClient && result.attendee && result.webinar) {
      try {
        const webinar = result.webinar
        const attendee = result.attendee

        const start = webinar.startTime ? new Date(webinar.startTime) : null
        const timeZone = process.env.WEBINAR_TIMEZONE || 'America/Los_Angeles'
        const startTimeFormatted = start
          ? formatInTimeZone(start, timeZone, "MMM dd, yyyy 'at' hh:mm a zzz")
          : 'To be announced'

        await resendClient.emails.send({
          from: 'Freedom Framework <no-reply@freedomframework.us>',
          to: attendee.email,
          subject: `Your registration is confirmed: ${webinar.title}`,
          react: React.createElement(WebinarRegistrationConfirmation, {
            attendeeName: attendee.name,
            webinarTitle: webinar.title,
            startTimeFormatted,
            zoomJoinUrl: webinar.zoomJoinUrl,
            zoomPassword: webinar.zoomPassword,
          }),
        })
      } catch (emailError) {
        console.error('Error sending registration confirmation email:', emailError)
      }
    }

    // If this webinar is integrated with Zoom, add the registrant so Zoom sends calendar invites.
    if (result.success && result.zoomWebinarId) {
      try {
        const { zoomClient } = await import('@/lib/zoom/client')

        // Naive split of full name into first/last for Zoom
        const [firstName, ...rest] = name.trim().split(' ')
        const lastName = rest.join(' ') || firstName

        await zoomClient.addMeetingRegistrant(result.zoomWebinarId, {
          email,
          first_name: firstName,
          last_name: lastName,
        })
      } catch (zoomError) {
        console.error('Error adding Zoom registrant:', zoomError)
        // Do not fail local registration if Zoom registrant call fails
      }
    }

    return result
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      status: 500,
      message: 'Something went wrong',
      data: null,
      error: error,
    };
  }
};

// Admin-only helper: remove a specific registration (Attendance record)
// and update seats tags if configured so /home and capacity stay in sync.
export const adminRemoveAttendance = async (attendanceId: string) => {
  try {
    const result = await prismaClient.$transaction(async (tx) => {
      const attendance = await tx.attendance.findUnique({
        where: { id: attendanceId },
        include: {
          webinar: true,
        },
      })

      if (!attendance) {
        return {
          success: false,
          status: 404,
          message: 'Registration not found',
        } as const
      }

      const webinar = attendance.webinar
      const { remaining, total } = parseSeatsFromTags(webinar.tags || [])

      if (remaining !== null && total !== null) {
        const newRemaining = Math.min(total, remaining + 1)
        const existingTags = webinar.tags || []
        const filteredTags = existingTags.filter((tag) => !tag.startsWith('seats:'))
        const updatedTags = [...filteredTags, `seats:${newRemaining}/${total}`]

        await tx.webinar.update({
          where: { id: webinar.id },
          data: {
            tags: updatedTags,
          },
        })
      }

      await tx.attendance.delete({
        where: { id: attendanceId },
      })

      return {
        success: true,
        status: 200,
        message: 'Registration removed successfully',
        webinarId: webinar.id,
      } as const
    })

    if (result.success) {
      revalidatePath('/home')
    }

    return result
  } catch (error) {
    console.error('Admin remove attendance error:', error)
    return {
      success: false,
      status: 500,
      message: 'Failed to remove registration',
      error,
    } as const
  }
}

// Admin helper: re-register an attendee using the standard registration flow,
// so seats, /home, Zoom, and confirmation email all behave consistently.
export const adminReRegisterAttendance = async ({
  webinarId,
  email,
  name,
  phone,
  businessName,
  description,
  userId,
}: {
  webinarId: string
  email: string
  name: string
  phone?: string
  businessName?: string
  description?: string
  userId?: string
}) => {
  return registerAttendee({
    webinarId,
    email,
    name,
    phone,
    businessName,
    description,
    userId,
  })
}
import { NextResponse } from 'next/server'
import { prismaClient } from '@/lib/prismaClient'
import { WebinarStatusEnum } from '@prisma/client'

const parseSeatsFromTags = (tags: string[] | null): { seatsRemaining: number | null; seatsTotal: number | null } => {
  if (!tags || tags.length === 0) {
    return { seatsRemaining: null, seatsTotal: null }
  }

  const seatTag = tags.find((tag) => tag.startsWith('seats:'))
  if (!seatTag) {
    return { seatsRemaining: null, seatsTotal: null }
  }

  const value = seatTag.replace('seats:', '').trim()
  const [remainingStr, totalStr] = value.split('/')

  const remaining = remainingStr ? Number.parseInt(remainingStr, 10) : Number.NaN
  const total = totalStr ? Number.parseInt(totalStr, 10) : Number.NaN

  if (!Number.isFinite(remaining) || !Number.isFinite(total)) {
    return { seatsRemaining: null, seatsTotal: null }
  }

  return {
    seatsRemaining: Math.max(0, remaining),
    seatsTotal: Math.max(0, total),
  }
}

export async function GET() {
  try {
    const now = new Date()

    const webinars = await prismaClient.webinar.findMany({
      where: {
        webinarStatus: {
          in: [
            WebinarStatusEnum.SCHEDULED,
            WebinarStatusEnum.WAITING_ROOM,
            WebinarStatusEnum.LIVE,
          ],
        },
      },
      orderBy: {
        startTime: 'asc',
      },
      select: {
        id: true,
        title: true,
        description: true,
        startTime: true,
        duration: true,
        tags: true,
      },
    })

    const upcoming = webinars
      .filter((webinar) => {
        const start = new Date(webinar.startTime)
        const durationMinutes = webinar.duration ?? 0
        const effectiveEnd = durationMinutes > 0
          ? new Date(start.getTime() + durationMinutes * 60000)
          : start

        return effectiveEnd >= now
      })
      .map((webinar) => {
        const { seatsRemaining, seatsTotal } = parseSeatsFromTags(webinar.tags)

        return {
          id: webinar.id,
          title: webinar.title,
          description: webinar.description,
          startTime: webinar.startTime,
          duration: webinar.duration,
          seatsRemaining,
          seatsTotal,
        }
      })

    return NextResponse.json({
      success: true,
      webinars: upcoming,
    })
  } catch (error) {
    console.error('Error fetching available webinars:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch available webinars' },
      { status: 500 },
    )
  }
}

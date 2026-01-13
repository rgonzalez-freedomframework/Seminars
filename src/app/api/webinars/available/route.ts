import { NextResponse } from 'next/server'
import { prismaClient } from '@/lib/prismaClient'
import { WebinarStatusEnum } from '@prisma/client'

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
      },
    })

    const upcoming = webinars.filter((webinar) => {
      const start = new Date(webinar.startTime)
      const durationMinutes = webinar.duration ?? 0
      const effectiveEnd = durationMinutes > 0
        ? new Date(start.getTime() + durationMinutes * 60000)
        : start

      return effectiveEnd >= now
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

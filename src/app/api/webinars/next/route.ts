import { NextResponse } from 'next/server'
import { prismaClient } from '@/lib/prismaClient'
import { WebinarStatusEnum } from '@prisma/client'

export async function GET() {
  try {
    const webinar = await prismaClient.webinar.findFirst({
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

    if (!webinar) {
      return NextResponse.json({ success: true, webinar: null })
    }

    return NextResponse.json({ success: true, webinar })
  } catch (error) {
    console.error('Error fetching next webinar:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch next webinar' }, { status: 500 })
  }
}
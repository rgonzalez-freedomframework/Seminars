import { NextResponse } from 'next/server'
import { onAuthenticateUser } from '@/actions/auth'
import { prismaClient } from '@/lib/prismaClient'

export async function GET() {
  try {
    const auth = await onAuthenticateUser()
    if (!auth?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const presenterId = auth.user.id

    const attendees = await prismaClient.attendee.findMany({
      include: {
        Attendance: {
          include: {
            webinar: {
              select: {
                id: true,
                title: true,
                startTime: true,
                zoomJoinUrl: true,
                zoomPassword: true,
              },
            },
          },
          where: {
            webinar: {
              presenterId,
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const header = [
      'Attendee Name',
      'Attendee Email',
      'Phone',
      'Business',
      'Description',
      'Call Status',
      'Webinar Title',
      'Webinar Start Time (UTC)',
      'Zoom Join URL',
      'Zoom Passcode',
    ]

    const rows: string[] = []
    rows.push(header.join(','))

    const escape = (value: unknown): string => {
      if (value === null || value === undefined) return ''
      const str = String(value)
      if (str.includes('"') || str.includes(',') || str.includes('\n')) {
        return '"' + str.replace(/"/g, '""') + '"'
      }
      return str
    }

    for (const attendee of attendees) {
      if (!attendee.Attendance.length) {
        rows.push([
          escape(attendee.name),
          escape(attendee.email),
          escape(attendee.phone),
          escape(attendee.businessName),
          escape(attendee.description),
          escape(attendee.callStatus),
          '',
          '',
          '',
          '',
        ].join(','))
        continue
      }

      for (const attendance of attendee.Attendance) {
        const webinar = attendance.webinar
        rows.push([
          escape(attendee.name),
          escape(attendee.email),
          escape(attendee.phone),
          escape(attendee.businessName),
          escape(attendee.description),
          escape(attendee.callStatus),
          escape(webinar?.title ?? ''),
          webinar?.startTime ? new Date(webinar.startTime).toISOString() : '',
          escape(webinar?.zoomJoinUrl ?? ''),
          escape(webinar?.zoomPassword ?? ''),
        ].join(','))
      }
    }

    const csv = rows.join('\n')

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="leads.csv"',
      },
    })
  } catch (error) {
    console.error('Export leads CSV error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

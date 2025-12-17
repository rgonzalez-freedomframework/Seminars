'use client'

import React from 'react'

type LeadWebinarBadgesProps = {
  attendances: {
    id: string
    webinar: {
      title: string
      startTime: string | Date
      zoomJoinUrl: string | null
      zoomPassword: string | null
    }
  }[]
}

const formatDateTime = (value: string | Date) => {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '-'

  return date.toLocaleString(undefined, {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const LeadWebinarBadges: React.FC<LeadWebinarBadgesProps> = ({ attendances }) => {
  if (!attendances || attendances.length === 0) {
    return <span className="text-xs text-gray-500">-</span>
  }

  return (
    <div className="flex flex-col items-end gap-2">
      {attendances.map((attendance) => {
        const { webinar } = attendance
        const formattedTime = formatDateTime(webinar.startTime)

        return (
          <div
            key={attendance.id}
            className="w-full max-w-sm rounded-lg bg-white border border-gray-200 shadow-sm px-3 py-2 text-right"
          >
            <div className="text-xs font-semibold text-[#1D2A38] truncate">
              {webinar.title}
            </div>
            <div className="text-[11px] text-gray-600">
              {formattedTime}
            </div>
            {webinar.zoomJoinUrl && (
              <div
                className="text-[11px] text-blue-700 truncate"
                title={webinar.zoomJoinUrl}
              >
                Zoom: {webinar.zoomJoinUrl}
              </div>
            )}
            {webinar.zoomPassword && (
              <div className="text-[11px] text-gray-600">
                Passcode: {webinar.zoomPassword}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default LeadWebinarBadges

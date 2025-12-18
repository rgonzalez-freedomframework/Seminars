'use client'

import React, { useState } from 'react'
import { adminRemoveAttendance, adminReRegisterAttendance } from '@/actions/attendance'
import { toast } from 'sonner'

type LeadWebinarBadgesProps = {
  attendances: {
    id: string
    webinar: {
      id: string
      title: string
      startTime: string | Date
      zoomJoinUrl: string | null
      zoomPassword: string | null
    }
  }[]
  attendeeInfo: {
    id: string
    name: string
    email: string
    phone?: string | null
    businessName?: string | null
    description?: string | null
  }
  isAdmin: boolean
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

const LeadWebinarBadges: React.FC<LeadWebinarBadgesProps> = ({ attendances, attendeeInfo, isAdmin }) => {
  const [statuses, setStatuses] = useState<Record<string, 'active' | 'removing' | 'removed' | 'readding'>>({})

  const setStatus = (id: string, status: 'active' | 'removing' | 'removed' | 'readding') => {
    setStatuses((prev) => ({ ...prev, [id]: status }))
  }

  const handleRemove = async (attendanceId: string) => {
    if (!isAdmin) return
    const current = statuses[attendanceId] || 'active'
    if (current === 'removing' || current === 'readding') return

    setStatus(attendanceId, 'removing')
    try {
      const res = await adminRemoveAttendance(attendanceId)
      if (!res.success) {
        toast.error(res.message || 'Failed to remove registration')
        setStatus(attendanceId, 'active')
        return
      }

      toast.success('Registration removed')
      setStatus(attendanceId, 'removed')
    } catch (error) {
      console.error('Failed to remove registration:', error)
      toast.error('Failed to remove registration')
      setStatus(attendanceId, 'active')
    }
  }

  const handleReRegister = async (attendanceId: string, webinarId: string) => {
    if (!isAdmin) return
    const current = statuses[attendanceId] || 'active'
    if (current === 'removing' || current === 'readding') return

    setStatus(attendanceId, 'readding')
    try {
      const res = await adminReRegisterAttendance({
        webinarId,
        email: attendeeInfo.email,
        name: attendeeInfo.name,
        phone: attendeeInfo.phone || undefined,
        businessName: attendeeInfo.businessName || undefined,
        description: attendeeInfo.description || undefined,
        userId: undefined,
      })

      if (!res.success) {
        toast.error(res.message || 'Failed to re-register attendee')
        setStatus(attendanceId, 'active')
        return
      }

      toast.success('Attendee re-registered and confirmation sent')
      setStatus(attendanceId, 'active')
    } catch (error) {
      console.error('Failed to re-register attendee:', error)
      toast.error('Failed to re-register attendee')
      setStatus(attendanceId, 'active')
    }
  }
  if (!attendances || attendances.length === 0) {
    return <span className="text-xs text-gray-500">-</span>
  }

  return (
    <div className="flex flex-col items-end gap-2">
      {attendances.map((attendance) => {
        const { webinar } = attendance
        const status = statuses[attendance.id] || 'active'
        const formattedTime = formatDateTime(webinar.startTime)

        return (
          <div
            key={attendance.id}
            className="w-full max-w-sm rounded-lg bg-white border border-gray-200 shadow-sm px-3 py-2 text-right"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
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
              {isAdmin && (
                <div className="flex flex-col items-end gap-1 ml-2">
                  {status === 'removed' ? (
                    <button
                      className="text-[11px] text-green-700 hover:underline disabled:opacity-50"
                      disabled={status === 'readding'}
                      onClick={() => handleReRegister(attendance.id, webinar.id)}
                    >
                      Re-register
                    </button>
                  ) : (
                    <button
                      className="text-[11px] text-red-600 hover:underline disabled:opacity-50"
                      disabled={status === 'removing' || status === 'readding'}
                      onClick={() => handleRemove(attendance.id)}
                    >
                      {status === 'removing' ? 'Removing…' : 'Remove'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default LeadWebinarBadges

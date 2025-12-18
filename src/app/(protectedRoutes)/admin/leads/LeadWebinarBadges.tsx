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
  availableWebinars: {
    id: string
    title: string
    startTime: string | Date
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

const LeadWebinarBadges: React.FC<LeadWebinarBadgesProps> = ({ attendances, attendeeInfo, isAdmin, availableWebinars }) => {
  const [statuses, setStatuses] = useState<Record<string, 'active' | 'removing' | 'removed' | 'readding'>>({})
  const [selectedWebinars, setSelectedWebinars] = useState<Record<string, string>>({})

  const setStatus = (id: string, status: 'active' | 'removing' | 'removed' | 'readding') => {
    setStatuses((prev) => ({ ...prev, [id]: status }))
  }

  const handleSelectWebinar = (attendanceId: string, webinarId: string) => {
    setSelectedWebinars((prev) => ({ ...prev, [attendanceId]: webinarId }))
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

  const handleMoveToSelectedWebinar = async (attendanceId: string) => {
    if (!isAdmin) return

    const targetWebinarId = selectedWebinars[attendanceId]
    if (!targetWebinarId) {
      toast.error('Please select a webinar to move this attendee to')
      return
    }

    const current = statuses[attendanceId] || 'removed'
    if (current === 'removing' || current === 'readding') return

    setStatus(attendanceId, 'readding')
    try {
      const res = await adminReRegisterAttendance({
        webinarId: targetWebinarId,
        email: attendeeInfo.email,
        name: attendeeInfo.name,
        phone: attendeeInfo.phone || undefined,
        businessName: attendeeInfo.businessName || undefined,
        description: attendeeInfo.description || undefined,
        userId: undefined,
      })

      if (!res.success) {
        toast.error(res.message || 'Failed to move attendee to selected webinar')
        setStatus(attendanceId, 'removed')
        return
      }

      toast.success('Attendee moved to selected webinar and confirmation sent')
      setStatus(attendanceId, 'removed')
    } catch (error) {
      console.error('Failed to move attendee to selected webinar:', error)
      toast.error('Failed to move attendee to selected webinar')
      setStatus(attendanceId, 'removed')
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
        const isReadding = statuses[attendance.id] === 'readding'
        const isBusy = status === 'removing' || status === 'readding'
        const formattedTime = formatDateTime(webinar.startTime)
        const otherWebinars = (availableWebinars || []).filter((w) => w.id !== webinar.id)

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
                    <>
                      <span className="text-[10px] text-gray-500 mb-1">Removed</span>
                      <button
                        className="text-[11px] text-green-700 hover:underline disabled:opacity-50"
                        disabled={isReadding}
                        onClick={() => handleReRegister(attendance.id, webinar.id)}
                      >
                        Re-register to same
                      </button>
                      {otherWebinars && otherWebinars.length > 0 && (
                        <div className="flex flex-col items-end gap-1 mt-1 w-full">
                          <select
                            className="w-full max-w-[220px] border border-gray-300 rounded px-1 py-[2px] text-[11px] text-gray-700 bg-white"
                            value={selectedWebinars[attendance.id] || ''}
                            onChange={(e) => handleSelectWebinar(attendance.id, e.target.value)}
                          >
                            <option value="">Move to another webinar…</option>
                            {otherWebinars.map((w) => {
                              const webinarTime = formatDateTime(w.startTime)
                              return (
                                <option key={w.id} value={w.id}>
                                  {w.title} — {webinarTime}
                                </option>
                              )
                            })}
                          </select>
                          {selectedWebinars[attendance.id] && (
                            <button
                              className="text-[11px] text-blue-700 hover:underline disabled:opacity-50"
                              disabled={isReadding}
                              onClick={() => handleMoveToSelectedWebinar(attendance.id)}
                            >
                              Move & send confirmation
                            </button>
                          )}
                          <span className="text-[10px] text-gray-500 text-right">
                            Sends new confirmation email
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <button
                      className="text-[11px] text-red-600 hover:underline disabled:opacity-50"
                      disabled={isBusy}
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

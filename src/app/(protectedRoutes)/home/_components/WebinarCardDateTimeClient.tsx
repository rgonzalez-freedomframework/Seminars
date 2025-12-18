'use client'

import React from 'react'

interface DateProps {
  startTime: string | Date
}

interface TimeProps {
  startTime: string | Date
  duration?: number | null
}

export const WebinarCardDate: React.FC<DateProps> = ({ startTime }) => {
  const date = new Date(startTime)
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  const dateLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone,
  }).format(date)

  return <>{dateLabel}</>
}

export const WebinarCardTime: React.FC<TimeProps> = ({ startTime, duration }) => {
  const date = new Date(startTime)
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  const timeLabel = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
    timeZoneName: 'short',
  }).format(date)

  return <>{timeLabel}{duration ? ` (${duration} min)` : ''}</>
}

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
  const dateLabel = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  return <>{dateLabel}</>
}

export const WebinarCardTime: React.FC<TimeProps> = ({ startTime, duration }) => {
  const date = new Date(startTime)
  const timeLabel = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })

  return <>{timeLabel}{duration ? ` (${duration} min)` : ''}</>
}

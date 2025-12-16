'use client'

import React, { useState } from 'react'
import { Webinar } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateWebinar } from '@/actions/webinarManagement'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, Loader2 } from 'lucide-react'
import { format } from 'date-fns'

type Props = {
  webinar: Webinar
}

const EditWebinarForm = ({ webinar }: Props) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const parseSeatsFromTags = (tags: string[] | null): { remaining: string; total: string } | null => {
    if (!tags || tags.length === 0) return null
    const seatTag = tags.find((tag) => tag.startsWith('seats:'))
    if (!seatTag) return null

    const value = seatTag.replace('seats:', '').trim()
    const [remainingStr, totalStr] = value.split('/')
    if (!remainingStr || !totalStr) return null

    return {
      remaining: remainingStr,
      total: totalStr,
    }
  }

  const initialSeats = parseSeatsFromTags((webinar as any).tags || [])

  const [formData, setFormData] = useState({
    title: webinar.title,
    description: webinar.description || '',
    startTime: format(new Date(webinar.startTime), "yyyy-MM-dd'T'HH:mm"),
    duration: webinar.duration,
    seatsRemaining: initialSeats?.remaining ?? '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const seatsRemainingNumber = formData.seatsRemaining.trim() === ''
        ? null
        : Math.max(0, parseInt(formData.seatsRemaining, 10) || 0)

      const previousTotal = initialSeats?.total
        ? Math.max(0, parseInt(initialSeats.total, 10) || 0)
        : null

      let seatsTotalNumber: number | null = null

      if (seatsRemainingNumber !== null) {
        if (previousTotal !== null) {
          seatsTotalNumber = Math.max(previousTotal, seatsRemainingNumber)
        } else {
          seatsTotalNumber = seatsRemainingNumber
        }
      } else {
        seatsTotalNumber = previousTotal
      }

      const existingTags = webinar.tags || []
      const filteredTags = existingTags.filter((tag) => !tag.startsWith('seats:'))

      const updatedTags =
        seatsRemainingNumber !== null && seatsTotalNumber !== null
          ? [...filteredTags, `seats:${seatsRemainingNumber}/${seatsTotalNumber}`]
          : filteredTags

      const result = await updateWebinar(webinar.id, {
        title: formData.title,
        description: formData.description,
        startTime: new Date(formData.startTime),
        duration: formData.duration,
        tags: updatedTags,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })

      if (result.status === 200) {
        const savedAt = new Date()
        const savedLabel = savedAt.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        })
        toast.success(`Webinar updated successfully at ${savedLabel}`)
        router.push('/admin/webinars')
        router.refresh()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Failed to update webinar')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="bg-[#F6F7F4] text-[#1D2A38]">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Update the core details of your webinar
            {webinar.zoomWebinarId && (
              <span className="block mt-2 text-blue-600 text-sm">
                Zoom Integration Active - Changes will sync with Zoom
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Webinar Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter webinar title"
              className="border-[#1D2A38]/40 bg-white text-[#1D2A38] placeholder:text-[#1D2A38]/60"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter webinar description"
              className="border-[#1D2A38]/40 bg-white text-[#1D2A38] placeholder:text-[#1D2A38]/60"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Start Date & Time *
              </Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="border-[#1D2A38]/40 bg-white text-[#1D2A38]"
                required
              />
              <p className="text-xs text-gray-500">Time is in your local timezone</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Duration (minutes) *
              </Label>
              <Input
                id="duration"
                type="number"
                min="15"
                max="480"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                placeholder="60"
                className="border-[#1D2A38]/40 bg-white text-[#1D2A38] placeholder:text-[#1D2A38]/60"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="seatsRemaining">
                Seats Remaining
              </Label>
              <Input
                id="seatsRemaining"
                type="number"
                min="0"
                value={formData.seatsRemaining}
                onChange={(e) => setFormData({ ...formData, seatsRemaining: e.target.value })}
                placeholder="e.g. 10"
                className="border-[#1D2A38]/40 bg-white text-[#1D2A38] placeholder:text-[#1D2A38]/60"
              />
              <p className="text-xs text-gray-500">
                This controls how many seats are currently available. Set to 0 to mark the webinar as sold out.
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#CCA43B] hover:bg-[#B8932F] text-[#1D2A38]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/webinars')}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      {webinar.webinarStatus !== 'ENDED' && webinar.webinarStatus !== 'CANCELLED' && (
        <Card className="mt-6 bg-[#F6F7F4] text-[#1D2A38]">
          <CardHeader>
            <CardTitle className="text-sm">Webinar Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Current Status</p>
                <p className="text-xs text-gray-500 mt-1">
                  Status: <span className="font-semibold">{webinar.webinarStatus}</span>
                </p>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  webinar.webinarStatus === 'LIVE'
                    ? 'bg-red-100 text-red-700'
                    : webinar.webinarStatus === 'WAITING_ROOM'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-blue-100 text-blue-700'
                }`}
              >
                {webinar.webinarStatus}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {webinar.zoomWebinarId && (
        <Card className="mt-6 bg-[#F6F7F4] text-[#1D2A38]">
          <CardHeader>
            <CardTitle className="text-sm">Zoom Meeting Details</CardTitle>
            <CardDescription>
              These values come directly from Zoom via the API.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-700">
            <div>
              <p className="font-medium text-[#1D2A38]">Meeting ID</p>
              <p className="mt-1 break-all">{webinar.zoomWebinarId}</p>
            </div>

            {webinar.zoomJoinUrl && (
              <div>
                <p className="font-medium text-[#1D2A38]">Join URL</p>
                <a
                  href={webinar.zoomJoinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block break-all text-blue-600 hover:underline"
                >
                  {webinar.zoomJoinUrl}
                </a>
              </div>
            )}

            <div>
              <p className="font-medium text-[#1D2A38]">Password</p>
              <p className="mt-1 text-xs text-gray-600">
                {webinar.zoomPassword
                  ? 'Stored and passed securely to the Zoom Meeting SDK.'
                  : 'No password returned by Zoom for this meeting.'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </form>
  )
}

export default EditWebinarForm

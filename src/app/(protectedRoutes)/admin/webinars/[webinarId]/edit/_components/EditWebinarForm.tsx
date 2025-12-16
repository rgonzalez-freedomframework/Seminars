'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Webinar } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateWebinar } from '@/actions/webinarManagement'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, Loader2, Image as ImageIcon, FileText, Trash2, Upload } from 'lucide-react'
import { format } from 'date-fns'

type Props = {
  webinar: Webinar
}

const EditWebinarForm = ({ webinar }: Props) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)

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
    thumbnail: webinar.thumbnail || '',
  })

  const [isThumbnailUploading, setIsThumbnailUploading] = useState(false)
  const [thumbnailUploadProgress, setThumbnailUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  type Resource = {
    id: string
    title: string
    description: string | null
    fileUrl: string
    fileName: string
    fileSize: number | null
    fileType: string | null
    createdAt: string
  }

  const [resources, setResources] = useState<Resource[]>([])
  const [isLoadingResources, setIsLoadingResources] = useState(true)
  const [isAddingResource, setIsAddingResource] = useState(false)
  const [newResourceTitle, setNewResourceTitle] = useState('')
  const [newResourceDescription, setNewResourceDescription] = useState('')
  const [newResourceFile, setNewResourceFile] = useState<File | null>(null)

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch(`/api/upload/resource?webinarId=${webinar.id}`)
        if (!res.ok) return
        const data = await res.json()
        setResources(data.resources || [])
      } catch (error) {
        console.error('Failed to load resources', error)
      } finally {
        setIsLoadingResources(false)
      }
    }

    fetchResources()
  }, [webinar.id])

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
        thumbnail: formData.thumbnail || null,
      })

      if (result.status === 200) {
        const savedAt = new Date()
        setLastSavedAt(savedAt)

        const savedLabel = savedAt.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        })
        toast.success(`Webinar updated successfully at ${savedLabel}`)
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

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, WebP, GIF)')
      return
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('Image file is too large. Maximum size is 5MB')
      return
    }

    setIsThumbnailUploading(true)
    setThumbnailUploadProgress(0)

    try {
      const form = new FormData()
      form.append('image', file)

      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: form,
      })

      if (!res.ok) {
        toast.error('Upload failed. Please try again.')
        return
      }

      const data = await res.json()
      setFormData((prev) => ({ ...prev, thumbnail: data.url }))
      setThumbnailUploadProgress(100)
      toast.success('Thumbnail uploaded successfully!')
    } catch (error) {
      console.error('Thumbnail upload error', error)
      toast.error('Failed to upload image')
    } finally {
      setIsThumbnailUploading(false)
      setTimeout(() => setThumbnailUploadProgress(0), 500)
    }
  }

  const handleRemoveThumbnail = () => {
    setFormData((prev) => ({ ...prev, thumbnail: '' }))
    toast.success('Thumbnail removed. Save changes to apply.')
  }

  const handleNewResourceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setNewResourceFile(file)
  }

  const handleAddResource = async () => {
    if (!newResourceTitle.trim()) {
      toast.error('Please enter a resource title')
      return
    }
    if (!newResourceFile) {
      toast.error('Please select a file')
      return
    }

    const maxSize = 50 * 1024 * 1024
    if (newResourceFile.size > maxSize) {
      toast.error('File is too large. Maximum size is 50MB')
      return
    }

    setIsAddingResource(true)

    try {
      const form = new FormData()
      form.append('file', newResourceFile)
      form.append('title', newResourceTitle)
      form.append('description', newResourceDescription)
      form.append('webinarId', webinar.id)

      const res = await fetch('/api/upload/resource', {
        method: 'POST',
        body: form,
      })

      if (!res.ok) {
        toast.error('Upload failed. Please try again.')
        return
      }

      const data = await res.json()
      if (data.resource) {
        setResources((prev) => [data.resource, ...prev])
      }

      setNewResourceTitle('')
      setNewResourceDescription('')
      setNewResourceFile(null)
      toast.success('Resource added successfully')
    } catch (error) {
      console.error('Error adding resource', error)
      toast.error('Failed to add resource')
    } finally {
      setIsAddingResource(false)
    }
  }

  const handleDeleteResource = async (id: string) => {
    try {
      const res = await fetch(`/api/upload/resource?resourceId=${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        toast.error('Failed to delete resource')
        return
      }

      setResources((prev) => prev.filter((r) => r.id !== id))
      toast.success('Resource removed')
    } catch (error) {
      console.error('Error deleting resource', error)
      toast.error('Failed to delete resource')
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
            {lastSavedAt && (
              <span className="block mt-2 text-xs text-emerald-700">
                Saved at{' '}
                {lastSavedAt.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                })}{' '}
                in your local timezone
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

      <Card className="mt-6 bg-[#F6F7F4] text-[#1D2A38]">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> Thumbnail
          </CardTitle>
          <CardDescription>
            Update the image shown on the live webinar page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.thumbnail ? (
            <div className="space-y-2">
              <img
                src={formData.thumbnail}
                alt="Webinar thumbnail"
                className="w-full max-w-md rounded-lg border border-[#1D2A38]/20 object-cover"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isThumbnailUploading}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Change Thumbnail
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveThumbnail}
                  className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">No thumbnail set yet.</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isThumbnailUploading}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Thumbnail
              </Button>
            </div>
          )}

          {isThumbnailUploading && (
            <p className="text-xs text-gray-500">Uploading... {thumbnailUploadProgress}%</p>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleThumbnailUpload}
          />

          <div className="pt-3 flex justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#CCA43B] hover:bg-[#B8932F] text-[#1D2A38] px-4 py-2 h-9 text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6 bg-[#F6F7F4] text-[#1D2A38]">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="w-4 h-4" /> Resources
          </CardTitle>
          <CardDescription>
            Manage documents and resources attendees can download.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="resourceTitle">Title</Label>
              <Input
                id="resourceTitle"
                value={newResourceTitle}
                onChange={(e) => setNewResourceTitle(e.target.value)}
                placeholder="e.g. Workbook, Slides, Checklist"
                className="border-[#1D2A38]/40 bg-white text-[#1D2A38] placeholder:text-[#1D2A38]/60"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resourceFile">File</Label>
              <Input
                id="resourceFile"
                type="file"
                onChange={handleNewResourceFileChange}
                className="border-[#1D2A38]/40 bg-white text-[#1D2A38]"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="resourceDescription">Short description (optional)</Label>
            <Textarea
              id="resourceDescription"
              value={newResourceDescription}
              onChange={(e) => setNewResourceDescription(e.target.value)}
              placeholder="Explain what this document is for."
              className="border-[#1D2A38]/40 bg-white text-[#1D2A38] placeholder:text-[#1D2A38]/60"
              rows={2}
            />
          </div>
          <Button
            type="button"
            size="sm"
            disabled={isAddingResource}
            onClick={handleAddResource}
            className="bg-[#CCA43B] hover:bg-[#B8932F] text-[#1D2A38] flex items-center gap-2"
          >
            {isAddingResource ? (
              <>
                <Loader2 className="w-4 h-4 mr-1 animate-spin" /> Adding...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" /> Add Resource
              </>
            )}
          </Button>

          <div className="pt-4 border-t border-[#1D2A38]/10">
            {isLoadingResources ? (
              <p className="text-xs text-gray-500">Loading existing resources...</p>
            ) : resources.length === 0 ? (
              <p className="text-xs text-gray-500">No resources added yet.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {resources.map((resource) => (
                  <li
                    key={resource.id}
                    className="flex items-center justify-between gap-3 bg-white border border-[#1D2A38]/10 rounded-md px-3 py-2"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#1D2A38] truncate">{resource.title}</p>
                      <p className="text-xs text-gray-500 truncate">{resource.fileName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={resource.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        View
                      </a>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={() => handleDeleteResource(resource.id)}
                        className="border-red-300 text-red-600 hover:bg-red-50 w-7 h-7"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="pt-3 flex justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#CCA43B] hover:bg-[#B8932F] text-[#1D2A38] px-4 py-2 h-9 text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
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

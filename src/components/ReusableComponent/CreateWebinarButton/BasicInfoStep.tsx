'use client'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { useWebinarStore } from '@/store/useWebinarStore'
import { format } from 'date-fns'
import { CalendarIcon, Clock, Upload, CheckCircle2, Loader2, X } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'

const BasicInfoStep = () => {
  const { formData, updateBasicInfoField, getStepValidationErrors } =
    useWebinarStore()
  const { date }=formData.basicInfo
  
  // State declarations must come before useEffect
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [isThumbnailUploading, setIsThumbnailUploading] = useState(false)
  const [thumbnailUploadProgress, setThumbnailUploadProgress] = useState(0)
  const [hasCapturedTimezone, setHasCapturedTimezone] = useState(false)
  
  // Debug logging
  useEffect(() => {
    console.log('BasicInfo formData changed:', {
      thumbnail: formData.basicInfo.thumbnail,
      videoUrl: formData.basicInfo.videoUrl,
      isPreRecorded: formData.basicInfo.isPreRecorded
    })
    console.log('UI State:', {
      isThumbnailUploading,
      isUploading,
      shouldShowThumbnailSuccess: !isThumbnailUploading && formData.basicInfo.thumbnail,
      shouldShowVideoSuccess: !isUploading && formData.basicInfo.videoUrl
    })
  }, [formData.basicInfo.thumbnail, formData.basicInfo.videoUrl, formData.basicInfo.isPreRecorded, isThumbnailUploading, isUploading])

  // Capture the browser's timezone once and store it in basicInfo
  useEffect(() => {
    if (!hasCapturedTimezone && !formData.basicInfo.timeZone) {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
      if (tz) {
        updateBasicInfoField('timeZone', tz)
        setHasCapturedTimezone(true)
      }
    }
  }, [formData.basicInfo.timeZone, hasCapturedTimezone, updateBasicInfoField])

  // Keep a combined local DateTime in basicInfo.dateTime for server use
  useEffect(() => {
    const d = formData.basicInfo.date
    const t = formData.basicInfo.time
    const fmt = formData.basicInfo.timeFormat || 'AM'

    if (!d || !t) {
      updateBasicInfoField('dateTime', undefined)
      return
    }

    const [hoursStr, minutesStr] = t.split(':')
    let hours = parseInt(hoursStr || '0', 10)
    const minutes = parseInt(minutesStr || '0', 10)

    if (fmt === 'PM' && hours < 12) {
      hours += 12
    } else if (fmt === 'AM' && hours === 12) {
      hours = 0
    }

    const combined = new Date(d)
    combined.setHours(hours, minutes, 0, 0)
    updateBasicInfoField('dateTime', combined)
  }, [formData.basicInfo.date, formData.basicInfo.time, formData.basicInfo.timeFormat, updateBasicInfoField])
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
    const { name, value } = e.target
    updateBasicInfoField(name as keyof typeof formData.basicInfo, value)
    }
  const errors=getStepValidationErrors('basicInfo')

    const handleDateChange = (newDate: Date | undefined) => {
        updateBasicInfoField('date', newDate)
        if (newDate) {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const selectedDate = new Date(newDate)
            selectedDate.setHours(0, 0, 0, 0)
            // Only show error if date is strictly before today (not including today)
            if (selectedDate.getTime() < today.getTime()) {
            toast.error('Webinar date cannot be in the past')
            console.log('Error: Cannot select a date in the past')
            }
        }
    }

const handleTimeFormatChange = (value: string) => {
  updateBasicInfoField('timeFormat', value as 'AM' | 'PM')
}

const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  // Validate file type
  const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
  if (!validTypes.includes(file.type)) {
    toast.error('Please upload a valid video file (MP4, WebM, OGG, MOV)')
    return
  }

  // Validate file size (max 500MB)
  const maxSize = 500 * 1024 * 1024
  if (file.size > maxSize) {
    toast.error('Video file is too large. Maximum size is 500MB')
    return
  }

  setVideoFile(file)
  setIsUploading(true)
  setUploadProgress(0)

  try {
    // Create form data
    const formData = new FormData()
    formData.append('video', file)

    // Upload with progress tracking
    const xhr = new XMLHttpRequest()
    
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const progress = Math.round((e.loaded / e.total) * 100)
        setUploadProgress(progress)
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText)
        console.log('Video upload response:', response)
        console.log('Setting video URL to:', response.url)
        updateBasicInfoField('videoUrl', response.url)
        console.log('Video state after update - uploading:', false, 'url:', response.url)
        toast.success('Video uploaded successfully!')
      } else {
        console.error('Video upload failed with status:', xhr.status)
        toast.error('Upload failed. Please try again.')
        setVideoFile(null)
      }
      setIsUploading(false)
    })

    xhr.addEventListener('error', () => {
      toast.error('Upload failed. Please try again.')
      setVideoFile(null)
      setIsUploading(false)
    })

    xhr.open('POST', '/api/upload/video')
    xhr.send(formData)
  } catch (error) {
    console.error('Upload error:', error)
    toast.error('Failed to upload video')
    setVideoFile(null)
    setIsUploading(false)
  }
}

const handleRemoveVideo = () => {
  setVideoFile(null)
  setUploadProgress(0)
  updateBasicInfoField('videoUrl', undefined)
  toast.success('Video removed')
}

const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  if (!validTypes.includes(file.type)) {
    toast.error('Please upload a valid image file (JPEG, PNG, WebP, GIF)')
    return
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    toast.error('Image file is too large. Maximum size is 5MB')
    return
  }

  setThumbnailFile(file)
  setIsThumbnailUploading(true)
  setThumbnailUploadProgress(0)

  try {
    const formData = new FormData()
    formData.append('image', file)

    const xhr = new XMLHttpRequest()
    
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const progress = Math.round((e.loaded / e.total) * 100)
        setThumbnailUploadProgress(progress)
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText)
        console.log('Thumbnail upload response:', response)
        console.log('Setting thumbnail URL to:', response.url)
        updateBasicInfoField('thumbnail', response.url)
        console.log('Thumbnail state after update - uploading:', false, 'url:', response.url)
        toast.success('Thumbnail uploaded successfully!')
      } else {
        console.error('Thumbnail upload failed with status:', xhr.status)
        toast.error('Upload failed. Please try again.')
        setThumbnailFile(null)
      }
      setIsThumbnailUploading(false)
    })

    xhr.addEventListener('error', () => {
      toast.error('Upload failed. Please try again.')
      setThumbnailFile(null)
      setIsThumbnailUploading(false)
    })

    xhr.open('POST', '/api/upload/image')
    xhr.send(formData)
  } catch (error) {
    console.error('Upload error:', error)
    toast.error('Failed to upload image')
    setThumbnailFile(null)
    setIsThumbnailUploading(false)
  }
}

const handleRemoveThumbnail = () => {
  setThumbnailFile(null)
  setThumbnailUploadProgress(0)
  updateBasicInfoField('thumbnail', undefined)
  toast.success('Thumbnail removed')
}

  return (
    <div className="space-y-6">
      <div className="space-y-2">
  		<Label htmlFor="webinarName" className={errors.webinarName ? 'text-red-400' : 'text-black'}>
            Webinar name <span className="text-red-400">*</span>
            </Label>
            <Input
            id="webinarName"
            name="webinarName"
            value={formData.basicInfo.webinarName || ''}
            onChange={handleChange}
            placeholder="Introduction to Mochi"
            className={cn(
              'bg-white border-2 border-gray-300 text-black',
                errors.webinarName && 'border-red-400 focus-visible:ring-red-400'
            )}
            />
            {errors.webinarName && (
            <p className="text-sm text-red-400">{errors.webinarName}</p>
        )}
      </div>
    <div className="space-y-2">
    <Label
            htmlFor="description"
      className={errors.description ? 'text-red-400' : 'text-black'}
        >
            Description <span className="text-red-400">*</span>
        </Label>
        <Textarea
            id="description"
            name="description"
            value={formData.basicInfo.description || ''}
            onChange={handleChange}
            placeholder="Tell customers what your webinar is about"
            className={cn(
            'min-h-[100px] bg-white border-2 border-gray-300 text-black',
            errors.description && 'border-red-400 focus-visible:ring-red-400'
            )}
        />
        {errors.description && (
            <p className="text-sm text-red-400">{errors.description}</p>
        )}
        </div>

        {/* Thumbnail Upload Section */}
        <div className="space-y-3 p-4 border-2 border-gray-300 rounded-lg bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-[#1D2A38]" />
              <div>
                <p className="text-sm font-medium text-black">Webinar Card Image</p>
                <p className="text-xs text-black">Upload a custom thumbnail for the webinar card</p>
              </div>
            </div>
            
            {!isThumbnailUploading && !formData.basicInfo.thumbnail && (
              <Button
                type="button"
                variant="outline"
                className="relative border-2 border-[#CCA43B] hover:bg-[#CCA43B]/10 text-[#1D2A38] font-semibold"
                disabled={isThumbnailUploading}
              >
                Choose Image
                <Input
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handleThumbnailUpload}
                  disabled={isThumbnailUploading}
                />
              </Button>
            )}
          </div>

          {/* Upload Progress */}
          {isThumbnailUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-black font-medium">Uploading...</span>
                <span className="text-[#CCA43B] font-semibold">{thumbnailUploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#CCA43B] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${thumbnailUploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-black flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Uploading {thumbnailFile?.name}...
              </p>
            </div>
          )}

          {/* Upload Success with Preview */}
          {!isThumbnailUploading && formData.basicInfo.thumbnail ? (
            <div className="space-y-3">
              <div className="relative w-full h-48 rounded-lg overflow-hidden border-4 border-green-500 shadow-lg">
                <img 
                  src={formData.basicInfo.thumbnail} 
                  alt="Webinar thumbnail" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  UPLOADED
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 border-2 border-green-500 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="text-base font-bold text-green-900">✓ Thumbnail Uploaded Successfully!</p>
                    <p className="text-xs text-green-700 mt-1 break-all">
                      {formData.basicInfo.thumbnail}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveThumbnail}
                  className="hover:bg-red-100 hover:text-red-600"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ) : null}

          <p className="text-xs text-black mt-2">
            Maximum file size: 5MB. Supported formats: JPEG, PNG, WebP, GIF
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className={errors.date ? 'text-red-400' : 'text-black'}>
                Webinar Date <span className="text-red-400">*</span>
                </Label>
                <Popover>
                <PopoverTrigger asChild>
                    <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal bg-white border-2 border-gray-300 text-black',
                      !date && 'text-black',
                        errors.date && 'border-red-400 focus-visible:ring-red-400'
                    )}
                    >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : 'Select date'}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4 bg-white border-2 border-[#CCA43B] shadow-xl z-50">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateChange}
                    initialFocus
                    className="bg-white rounded-md p-3"
                    classNames={{
                      months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                      month: "space-y-4",
                      caption: "flex justify-center pt-1 relative items-center text-[#1D2A38] font-bold text-lg",
                      caption_label: "text-[#1D2A38] font-bold",
                      nav: "space-x-1 flex items-center",
                      nav_button: "h-8 w-8 bg-transparent hover:bg-gray-200 text-[#1D2A38] rounded-md border border-gray-300 font-bold",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex mt-2",
                      head_cell: "text-[#1D2A38] rounded-md w-10 font-bold text-sm",
                      row: "flex w-full mt-2",
                      cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-[#CCA43B]/20 [&:has([aria-selected].day-outside)]:bg-transparent",
                      day: "h-10 w-10 p-0 font-bold text-[#1D2A38] hover:bg-gray-200 hover:text-[#1D2A38] rounded-md transition-colors",
                      day_selected: "bg-[#CCA43B] text-white hover:bg-[#B8932F] hover:text-white focus:bg-[#CCA43B] focus:text-white font-bold",
                      day_today: "bg-blue-100 text-[#1D2A38] font-bold border-2 border-blue-400",
                      day_outside: "text-gray-400 opacity-50",
                      day_disabled: "text-gray-300 opacity-50 line-through",
                      day_hidden: "invisible",
                    }}
                    disabled={(date) => {
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    const checkDate = new Date(date)
                    checkDate.setHours(0, 0, 0, 0)
                    return checkDate < today // Only block dates before today, not today itself
                    }}
                />
                </PopoverContent>
               </Popover>
            {errors.date && <p className="text-sm text-red-400">{errors.date}</p>}
            </div>

            <div className="space-y-2">
            <Label className={errors.time ? 'text-red-400' : 'text-black'}>
                Webinar Time <span className="text-red-400">*</span>
            </Label>
                    <div className="flex gap-2">
  <div className="relative flex-1">
            <Clock className="absolute left-3 top-2.5 h-4 w-4 text-black" />
            <Input
            name="time"
            value={formData.basicInfo.time || ''}
            onChange={handleChange}
            placeholder="12:00"
            className={cn(
              'pl-9 bg-white border-2 border-gray-300 text-black',
                errors.time && 'border-red-400 focus-visible:ring-red-400'
            )}
            />
        </div>
        <Select
            value={formData.basicInfo.timeFormat || 'AM'}
            onValueChange={handleTimeFormatChange}
            >
            <SelectTrigger className="w-20 bg-white border-2 border-gray-300 text-black">
                <SelectValue placeholder="AM" />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 border-gray-300 z-50">
                <SelectItem value="AM" className="text-black hover:bg-[#CCA43B]/10 cursor-pointer">AM</SelectItem>
                <SelectItem value="PM" className="text-black hover:bg-[#CCA43B]/10 cursor-pointer">PM</SelectItem>
            </SelectContent>
        </Select>
            </div>
            {errors.time && <p className='text-sm text-red-400'>{errors.time}</p>}
            </div>
        </div>

        {/* Duration Field */}
        <div className="space-y-2">
          <Label htmlFor="duration" className="text-black">
                Duration (minutes) <span className="text-red-400">*</span>
            </Label>
            <Input
                id="duration"
                name="duration"
                type="number"
                min="15"
                max="480"
                value={formData.basicInfo.duration || 60}
                onChange={handleChange}
                placeholder="60"
                className="bg-white border-2 border-gray-300 text-black"
            />
              <p className="text-sm text-black">Enter webinar duration in minutes (15-480)</p>
        </div>

        {/* Video Upload Section */}
        <div className="space-y-3 p-4 border-2 border-gray-300 rounded-lg bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-[#1D2A38]" />
              <div>
                <p className="text-sm font-medium text-black">Pre-recorded Video</p>
                <p className="text-xs text-black">Upload a video to make this webinar pre-recorded</p>
              </div>
            </div>
            
            {!isUploading && !formData.basicInfo.videoUrl && (
              <Button
                type="button"
                variant="outline"
                className="relative border-2 border-[#CCA43B] hover:bg-[#CCA43B]/10 text-[#1D2A38] font-semibold"
                disabled={isUploading}
              >
                Choose Video
                <Input
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  type="file"
                  accept="video/mp4,video/webm,video/ogg,video/quicktime"
                  onChange={handleVideoUpload}
                  disabled={isUploading}
                />
              </Button>
            )}
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-black font-medium">Uploading...</span>
                <span className="text-[#CCA43B] font-semibold">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#CCA43B] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-black flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Uploading {videoFile?.name}...
              </p>
            </div>
          )}

          {/* Upload Success */}
          {!isUploading && formData.basicInfo.videoUrl ? (
            <div className="flex items-center justify-between p-4 bg-green-50 border-4 border-green-500 rounded-lg shadow-lg">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <div>
                  <p className="text-base font-bold text-green-900">✓ Video Uploaded Successfully!</p>
                  <p className="text-xs text-green-700 mt-1 break-all">
                    {formData.basicInfo.videoUrl}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveVideo}
                className="hover:bg-red-100 hover:text-red-600"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          ) : null}

          <p className="text-xs text-black mt-2">
            Maximum file size: 500MB. Supported formats: MP4, WebM, OGG, MOV
          </p>
        </div>
    </div>
  )
}

export default BasicInfoStep
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
import React, { useState } from 'react'
import { toast } from 'sonner'

const BasicInfoStep = () => {
  const { formData, updateBasicInfoField, getStepValidationErrors } =
    useWebinarStore()
  const { date }=formData.basicInfo
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
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
            if (newDate < today) {
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
        updateBasicInfoField('videoUrl', response.url)
        toast.success('Video uploaded successfully!')
      } else {
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

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="webinarName" className={errors.webinarName ? 'text-red-400' : 'text-[#1D2A38]'}>
            Webinar name <span className="text-red-400">*</span>
            </Label>
            <Input
            id="webinarName"
            name="webinarName"
            value={formData.basicInfo.webinarName || ''}
            onChange={handleChange}
            placeholder="Introduction to Mochi"
            className={cn(
                'bg-white border-2 border-gray-300 text-[#1D2A38]',
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
            className={errors.description ? 'text-red-400' : 'text-[#1D2A38]'}
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
            'min-h-[100px] bg-white border-2 border-gray-300 text-[#1D2A38]',
            errors.description && 'border-red-400 focus-visible:ring-red-400'
            )}
        />
        {errors.description && (
            <p className="text-sm text-red-400">{errors.description}</p>
        )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="date" className={errors.date ? 'text-red-400' : 'text-[#1D2A38]'}>
                Webinar Date <span className="text-red-400">*</span>
                </Label>
                <Popover>
                <PopoverTrigger asChild>
                    <Button
                    variant="outline"
                    className={cn(
                        'w-full justify-start text-left font-normal bg-white border-2 border-gray-300 text-[#1D2A38]',
                        !date && 'text-gray-500',
                        errors.date && 'border-red-400 focus-visible:ring-red-400'
                    )}
                    >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : 'Select date'}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white border-2 border-[#CCA43B] shadow-xl z-50">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateChange}
                    initialFocus
                    className="bg-white rounded-md"
                    classNames={{
                      day_selected: "bg-[#CCA43B] text-[#1D2A38] hover:bg-[#B8932F] hover:text-[#1D2A38] focus:bg-[#CCA43B] focus:text-[#1D2A38]",
                      day_today: "bg-gray-100 text-[#1D2A38]",
                      day: "hover:bg-gray-100",
                      head_cell: "text-[#1D2A38] font-medium",
                      cell: "text-[#1D2A38]",
                      caption: "text-[#1D2A38] font-semibold",
                      nav_button: "hover:bg-gray-100 text-[#1D2A38]",
                      nav_button_previous: "hover:bg-gray-100",
                      nav_button_next: "hover:bg-gray-100",
                    }}
                    disabled={(date) => {
                    const today = new Date()
                    today.setHours(0, 0, 0, 0) // Reset time to start of day
                    return date < today
                    }}
                />
                </PopoverContent>
               </Popover>
            {errors.date && <p className="text-sm text-red-400">{errors.date}</p>}
            </div>

            <div className="space-y-2">
            <Label className={errors.time ? 'text-red-400' : 'text-[#1D2A38]'}>
                Webinar Time <span className="text-red-400">*</span>
            </Label>
                    <div className="flex gap-2">
  <div className="relative flex-1">
            <Clock className="absolute left-3 top-2.5 h-4 w-4 text-[#1D2A38]" />
            <Input
            name="time"
            value={formData.basicInfo.time || ''}
            onChange={handleChange}
            placeholder="12:00"
            className={cn(
                'pl-9 bg-white border-2 border-gray-300 text-[#1D2A38]',
                errors.time && 'border-red-400 focus-visible:ring-red-400'
            )}
            />
        </div>
        <Select
            value={formData.basicInfo.timeFormat || 'AM'}
            onValueChange={handleTimeFormatChange}
            >
            <SelectTrigger className="w-20 bg-white border-2 border-gray-300 text-[#1D2A38]">
                <SelectValue placeholder="AM" />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 border-gray-300">
                <SelectItem value="AM">AM</SelectItem>
                <SelectItem value="PM">PM</SelectItem>
            </SelectContent>
        </Select>
            </div>
            {errors.time && <p className='text-sm text-red-400'>{errors.time}</p>}
            </div>
        </div>

        {/* Duration Field */}
        <div className="space-y-2">
            <Label htmlFor="duration" className="text-[#1D2A38]">
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
                className="bg-white border-2 border-gray-300 text-[#1D2A38]"
            />
            <p className="text-sm text-gray-600">Enter webinar duration in minutes (15-480)</p>
        </div>

        {/* Video Upload Section - TEMPORARILY DISABLED 
            TODO: Re-enable after running database migration for videoUrl field
        <div className="space-y-3 p-4 border-2 border-gray-300 rounded-lg bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-[#1D2A38]" />
              <div>
                <p className="text-sm font-medium text-[#1D2A38]">Pre-recorded Video</p>
                <p className="text-xs text-gray-600">Upload a video to make this webinar pre-recorded</p>
              </div>
            </div>
            
            {!videoFile && !isUploading && (
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
                <span className="text-[#1D2A38] font-medium">Uploading...</span>
                <span className="text-[#CCA43B] font-semibold">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#CCA43B] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Uploading {videoFile?.name}...
              </p>
            </div>
          )}

          {/* Upload Success */}
          {videoFile && !isUploading && (
            <div className="flex items-center justify-between p-3 bg-green-50 border-2 border-green-300 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-900">{videoFile.name}</p>
                  <p className="text-xs text-green-700">
                    {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
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
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-2">
            Maximum file size: 500MB. Supported formats: MP4, WebM, OGG, MOV
          </p>
        </div>
        */}
    </div>
  )
}

export default BasicInfoStep
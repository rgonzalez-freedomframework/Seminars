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
import { CalendarIcon, Clock, Upload } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

const BasicInfoStep = () => {
  const { formData, updateBasicInfoField, getStepValidationErrors } =
    useWebinarStore()
  const { date }=formData.basicInfo
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
                <PopoverContent className="w-auto p-0 bg-white border-2 border-gray-300">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateChange}
                    initialFocus
                    className="bg-white"
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

        <div className="flex items-center gap-2 text-sm text-gray-600 mt-4">
            <div className="flex items-center">
                <Upload className="h-4 w-4 mr-2 text-[#1D2A38]" />
                Uploading a video makes this webinar pre-recorded.
            </div>
            <Button
                variant="outline"
                className="ml-auto relative border-2 border-gray-300 hover:bg-gray-100 text-[#1D2A38]"
            >
                Upload File
                <Input
                className="absolute inset-0 opacity-0 cursor-pointer"
                type="file"
                />
            </Button>
        </div>
    </div>
  )
}

export default BasicInfoStep
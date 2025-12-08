'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { useWebinarStore } from '@/store/useWebinarStore'
import { Info, Upload, FileText, X, Loader2, CheckCircle2 } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface ResourceUpload {
  title: string
  description: string
  file: File | null
  fileUrl?: string
  uploading: boolean
  progress: number
}

const AdditionalInfoStep = () => {
  const { formData, updateAdditionalInfoField, getStepValidationErrors } =
    useWebinarStore()
    const {lockChat , couponCode,couponEnabled}=formData.additionalInfo
    const [resources, setResources] = useState<ResourceUpload[]>([])
    const [newResource, setNewResource] = useState<ResourceUpload>({
      title: '',
      description: '',
      file: null,
      uploading: false,
      progress: 0
    })
    const handleToggleLockChat = (checked: boolean) => {
  updateAdditionalInfoField('lockChat', checked)
}
const handleToggleCoupon = (checked: boolean) => {
  updateAdditionalInfoField('couponEnabled', checked)
}

const handleCouponCodeChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  updateAdditionalInfoField('couponCode', e.target.value)
}

const errors = getStepValidationErrors('additionalInfo')

const handleResourceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  // Validate file size (max 50MB)
  const maxSize = 50 * 1024 * 1024
  if (file.size > maxSize) {
    toast.error('File is too large. Maximum size is 50MB')
    return
  }

  setNewResource(prev => ({ ...prev, file }))
}

const handleAddResource = async () => {
  if (!newResource.title.trim()) {
    toast.error('Please enter a resource title')
    return
  }
  if (!newResource.file) {
    toast.error('Please select a file')
    return
  }

  setNewResource(prev => ({ ...prev, uploading: true, progress: 0 }))

  try {
    const formData = new FormData()
    formData.append('file', newResource.file)
    formData.append('title', newResource.title)
    formData.append('description', newResource.description)

    const xhr = new XMLHttpRequest()
    
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const progress = Math.round((e.loaded / e.total) * 100)
        setNewResource(prev => ({ ...prev, progress }))
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText)
        
        // Add to resources list
        const uploadedResource: ResourceUpload = {
          title: newResource.title,
          description: newResource.description,
          file: newResource.file,
          fileUrl: response.url,
          uploading: false,
          progress: 100
        }
        
        setResources(prev => [...prev, uploadedResource])
        
        // Store in form data
        updateAdditionalInfoField('resources', [...(formData.additionalInfo.resources || []), {
          title: newResource.title,
          description: newResource.description,
          fileUrl: response.url,
          fileName: response.filename,
          fileSize: newResource.file?.size || 0,
          fileType: newResource.file?.type || ''
        }])
        
        // Reset form
        setNewResource({
          title: '',
          description: '',
          file: null,
          uploading: false,
          progress: 0
        })
        
        toast.success('Resource added successfully!')
      } else {
        toast.error('Upload failed. Please try again.')
      }
      setNewResource(prev => ({ ...prev, uploading: false }))
    })

    xhr.addEventListener('error', () => {
      toast.error('Upload failed. Please try again.')
      setNewResource(prev => ({ ...prev, uploading: false }))
    })

    xhr.open('POST', '/api/upload/resource')
    xhr.send(formData)
  } catch (error) {
    console.error('Upload error:', error)
    toast.error('Failed to upload resource')
    setNewResource(prev => ({ ...prev, uploading: false }))
  }
}

const handleRemoveResource = (index: number) => {
  const updatedResources = resources.filter((_, i) => i !== index)
  setResources(updatedResources)
  
  const resourceData = updatedResources.map(r => ({
    title: r.title,
    description: r.description,
    fileUrl: r.fileUrl || '',
    fileName: r.file?.name || '',
    fileSize: r.file?.size || 0,
    fileType: r.file?.type || ''
  }))
  
  updateAdditionalInfoField('resources', resourceData)
  toast.success('Resource removed')
}

  return (
    <div className="space-y-6">
        {/* Zoom Integration Toggle */}
        <div className="flex items-center justify-between p-4 border-2 border-gray-300 rounded-lg bg-white hover:border-[#CCA43B]/50 transition-colors">
        <div className="flex-1">
            <Label htmlFor="enable-zoom" className="text-base font-semibold text-[#1D2A38] cursor-pointer">
            Zoom Integration
            </Label>
            <p className="text-sm text-gray-600 mt-1">
            Automatically create a Zoom webinar for this event
            </p>
        </div>
        <Switch 
          id="enable-zoom"
          checked={formData.additionalInfo.enableZoom || false}
          onCheckedChange={(checked) => updateAdditionalInfoField('enableZoom', checked)}
          className="data-[state=checked]:bg-[#CCA43B]"
        />
        </div>

        <div className="flex items-center justify-between p-4 border-2 border-gray-300 rounded-lg bg-white hover:border-[#CCA43B]/50 transition-colors">
        <div className="flex-1">
            <Label htmlFor="lock-chat" className="text-base font-semibold text-[#1D2A38] cursor-pointer">
            Lock Chat
            </Label>
            <p className="text-sm text-gray-600 mt-1">
            Turn it on to make chat visible to your users at all time
            </p>
        </div>
        <Switch 
          id="lock-chat"
          checked={lockChat||false}
          onCheckedChange={handleToggleLockChat}
          className="data-[state=checked]:bg-[#CCA43B]"
        />
        </div>

    <div className="space-y-4 p-4 border-2 border-gray-300 rounded-lg bg-white">
    <div className="flex items-center justify-between">
        <div className="flex-1">
        <Label htmlFor="coupon-enabled" className="text-base font-semibold text-[#1D2A38] cursor-pointer">
            Coupon Code
        </Label>
        <p className="text-sm text-gray-600 mt-1">
            Turn it on to offer discounts to your viewers
        </p>
        </div>
        <Switch
        id="coupon-enabled"
        checked={formData.additionalInfo.couponEnabled || false}
        onCheckedChange={handleToggleCoupon}
        className="data-[state=checked]:bg-[#CCA43B]"
        />
    </div>
            {couponEnabled && (
                <div className="space-y-2 pt-2 border-t-2 border-gray-200">
                    <Label htmlFor="coupon-code" className="text-sm font-medium text-[#1D2A38]">
                      Enter Coupon Code
                    </Label>
                    <Input
                    id="coupon-code"
                    value={couponCode || ''}
                    onChange={handleCouponCodeChange}
                    placeholder="e.g., SAVE20"
                    className={cn(
                        'bg-white border-2 border-gray-300 text-[#1D2A38] focus:border-[#CCA43B]',
                        errors.couponCode && 'border-red-400 focus-visible:ring-red-400'
                    )}
                    />
                    {errors.couponCode && (
                    <p className="text-sm text-red-400">{errors.couponCode}</p>
                    )}
                    <div className="flex items-start gap-2 text-xs text-gray-600 bg-blue-50 p-3 rounded-md border border-blue-200">
                    <Info className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                    <p>
                        This coupon code can be used to promote a sale. Users can apply it
                        when using the &quot;Buy Now&quot; CTA during the webinar.
                    </p>
                    </div>
                </div>
                )}

    </div>

    {/* Resources Upload Section */}
    <div className="space-y-4 p-4 border-2 border-gray-300 rounded-lg bg-white">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="h-5 w-5 text-[#1D2A38]" />
        <div>
          <h3 className="text-base font-semibold text-[#1D2A38]">Webinar Resources</h3>
          <p className="text-sm text-gray-600">Add downloadable files for attendees</p>
        </div>
      </div>

      {/* Add New Resource Form */}
      <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#1D2A38]">Resource Title</Label>
          <Input
            value={newResource.title}
            onChange={(e) => setNewResource(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., Webinar Slides, Workbook, Checklist"
            className="bg-white border-2 border-gray-300"
            disabled={newResource.uploading}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#1D2A38]">Description (Optional)</Label>
          <Textarea
            value={newResource.description}
            onChange={(e) => setNewResource(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Brief description of this resource"
            className="bg-white border-2 border-gray-300 min-h-[60px]"
            disabled={newResource.uploading}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#1D2A38]">File</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="relative flex-1 border-2 border-gray-300 hover:border-[#CCA43B]"
              disabled={newResource.uploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {newResource.file ? newResource.file.name : 'Choose File'}
              <Input
                className="absolute inset-0 opacity-0 cursor-pointer"
                type="file"
                onChange={handleResourceFileChange}
                disabled={newResource.uploading}
              />
            </Button>
            <Button
              type="button"
              onClick={handleAddResource}
              disabled={!newResource.title.trim() || !newResource.file || newResource.uploading}
              className="bg-[#CCA43B] hover:bg-[#CCA43B]/90 text-white"
            >
              {newResource.uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {newResource.progress}%
                </>
              ) : (
                'Add Resource'
              )}
            </Button>
          </div>
          {newResource.file && (
            <p className="text-xs text-gray-600">
              {(newResource.file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          )}
        </div>
      </div>

      {/* Uploaded Resources List */}
      {resources.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#1D2A38]">Added Resources ({resources.length})</Label>
          <div className="space-y-2">
            {resources.map((resource, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-3 bg-green-50 border-2 border-green-300 rounded-lg"
              >
                <div className="flex items-start gap-2 flex-1">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-green-900">{resource.title}</p>
                    {resource.description && (
                      <p className="text-xs text-green-700 mt-1">{resource.description}</p>
                    )}
                    <p className="text-xs text-green-600 mt-1">
                      {resource.file?.name} ({((resource.file?.size || 0) / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveResource(index)}
                  className="hover:bg-red-100 hover:text-red-600 flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Maximum file size: 50MB per file. Resources will be available to all registered attendees.
      </p>
    </div>
    </div>
    )
}

export default AdditionalInfoStep
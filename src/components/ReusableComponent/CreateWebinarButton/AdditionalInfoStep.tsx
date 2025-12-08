'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { useWebinarStore } from '@/store/useWebinarStore'
import { Info } from 'lucide-react'
import React from 'react'

const AdditionalInfoStep = () => {
  const { formData, updateAdditionalInfoField, getStepValidationErrors } =
    useWebinarStore()
    const {lockChat , couponCode,couponEnabled}=formData.additionalInfo
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
    </div>
    )
}

export default AdditionalInfoStep
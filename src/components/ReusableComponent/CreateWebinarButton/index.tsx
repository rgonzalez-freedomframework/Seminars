'use client'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'
import { useWebinarStore } from '@/store/useWebinarStore'
import { Plus } from 'lucide-react'
import React, { useState } from 'react'
import MultiStepForm from './MultiStepForm'
import BasicInfoStep from './BasicInfoStep'
import CTAStep from './CTAStep'
import AdditionalInfoStep from './AdditionalInfoStep'
import SuccessStep from './SuccessStep'

function CreateWebinarButton() {
  const { isModalOpen, setModalOpen,isComplete, setComplete,resetForm} = useWebinarStore()
  const [webinarLink,setWebinarLink]=useState('')
  const steps = [
  {
    id: 'basicInfo',
    title: 'Basic Information',
    description: 'Please fill out the standard info needed for your webinar',
    component: <BasicInfoStep />,
  },
  {
    id: 'cta',
    title: 'CTA',
    description: 'Please provide the end-point for your customers through your webinar',
    component: <CTAStep />,
  },
  {
    id: 'additionalInfo',
    title: 'Additional information',
    description: 'Please fill out information about additional options if necessary',
    component: <AdditionalInfoStep/>,
  },
]

  const handleComplete = (webinarId: string) => {
    setComplete(true)
    setWebinarLink(
      `${process.env.NEXT_PUBLIC_BASE_URL}/live-webinar/${webinarId}`
    )
  }

  const handleCreateNew=()=>{
    resetForm()
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogTrigger asChild>
            <button
                className="rounded-xl flex gap-2 items-center hover:cursor-pointer px-4 py-2 border-2 border-[#1D2A38] bg-white text-sm font-semibold text-[#1D2A38] hover:bg-[#1D2A38] hover:text-white transition-all"
                onClick={() => setModalOpen(true)}
            >
                <Plus className="w-4 h-4" />
                Create Webinar
            </button>
        </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto p-0 bg-white border-2 border-gray-300">
        {isComplete ? (
          <div className="bg-white text-[#1D2A38] rounded-lg overflow-hidden">
            <DialogTitle className="sr-only">Webinar Created</DialogTitle>
            <SuccessStep
              webinarLink={webinarLink}
              onCreateNew={handleCreateNew}
            />
          </div>
        ) : (
          <>
            <DialogTitle className="sr-only">Create Webinar</DialogTitle>
            {/* Hidden description for accessibility to satisfy Radix requirements */}
            <DialogDescription className="sr-only">
              Multi-step form to configure basic information, call-to-action, and additional options for your webinar.
            </DialogDescription>
            <MultiStepForm
            steps={steps} 
            onComplete={handleComplete}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default CreateWebinarButton
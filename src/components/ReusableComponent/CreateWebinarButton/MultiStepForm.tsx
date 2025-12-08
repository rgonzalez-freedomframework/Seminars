import { useWebinarStore } from '@/store/useWebinarStore'
import React, { useState } from 'react'
import {AnimatePresence, motion} from 'framer-motion'
import { AlertCircle, Check, ChevronRight, Loader2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { createWebinar } from '@/actions/webinar'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type Step = {
  id: string
  title: string
  description: string
  component: React.ReactNode
}

type Props = {
  steps: Step[]
  onComplete: (id: string) => void
}

const MultiStepForm = ({ steps, onComplete }: Props) => {
  const {
    formData,
    validateStep,
    isSubmitting,
    setSubmitting,
    setModalOpen,
  } = useWebinarStore()
  const router=useRouter()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [completedSteps, setCompletedSteps] = useState<string[]>([])
    const [validationError, setValidationError] = useState<string | null>(null)

    const currentStep = steps[currentStepIndex]
    const isFirstStep = currentStepIndex === 0
    const isLastStep = currentStepIndex === steps.length - 1

    const handleBack = () => {
    if (isFirstStep) {
        setModalOpen(false)
    } else {
        setCurrentStepIndex(currentStepIndex - 1)
        setValidationError(null)
    }
    }

    const handleNext = async () => {
    setValidationError(null)
    console.log('=== STEP NAVIGATION ===')
    console.log('Current step:', currentStep.id)
    console.log('FormData before validation:', {
      thumbnail: formData.basicInfo.thumbnail,
      videoUrl: formData.basicInfo.videoUrl,
      isPreRecorded: formData.basicInfo.isPreRecorded,
      resources: formData.additionalInfo.resources
    })
    const isValid = validateStep(currentStep.id as keyof typeof formData)

    if (!isValid) {
        setValidationError('Please fill in all required fields')
        return
    }
    if (!completedSteps.includes(currentStep.id)) {
  setCompletedSteps([...completedSteps, currentStep.id])
}

    if (isLastStep) {
    try {
        setSubmitting(true)
        const result = await createWebinar(formData)
        if (result.status === 200 && result.webinarId) {
        toast.success('Your webinar has been created successfully.')
        onComplete(result.webinarId)
        } else {
        toast.error(
            result.message || 'Your webinar has not been created successfully'
        )
        setValidationError(result.message)
        }
        router.refresh()
    } catch (error) {
        console.error('Error creating webinar:', error)
        toast.error('Failed to create webinar. Please try again.')
        setValidationError('Failed to create webinar. Please try again.')
    } finally {
        setSubmitting(false)
    }
    } else {
    setCurrentStepIndex(currentStepIndex + 1)
    }
}
    return (
        <div className="flex flex-col justify-center items-center bg-white border-2 border-gray-300 rounded-3xl overflow-hidden max-w-6xl mx-auto text-[#1D2A38]">
      <div className="flex items-center justify-start">
        <div className="w-full md:w-1/3 p-6">
          <div className="space-y-6">
            {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id)
            const isCurrent = index === currentStepIndex
            const isPast = index < currentStepIndex
            return (
                <div key={step.id} className="relative">
                <div className="flex items-start gap-4">
                    <div className="relative">
                        <motion.div
                        initial={false}
                        animate={{
                            backgroundColor: isCurrent || isCompleted ? 'rgb(204, 164, 59)' : 'rgb(209, 213, 219)',
                            scale: [isCurrent && !isCompleted ? 0.8 : 1, 1],
                        }}
                        transition={{ duration: 0.3 }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '2rem',
                            height: '2rem',
                            borderRadius: '9999px',
                            zIndex: 10,
                        }}
                        >
                        <AnimatePresence mode="wait">
                            {isCompleted ? (
                            <motion.div
                                key="check"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Check className="w-5 h-5 text-white" />
                            </motion.div>
                            ) : (
                            <motion.div
                                key="number"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.2 }}
                                style={{ color: '#1D2A38' }}
                            >
                                <Check className="w-5 h-5 text-gray-400" />
                            </motion.div>
                            )}
                        </AnimatePresence>
                        </motion.div>
                        {index < steps.length - 1 && (
                        <div className="absolute top-8 left-4 w-0.5 h-16 bg-gray-300 overflow-hidden">
                            <motion.div
                            initial={{
                                height: isPast || isCompleted ? '100%' : '0%',
                            }}
                            animate={{
                                height: isPast || isCompleted ? '100%' : '0%',
                                backgroundColor: 'rgb(204, 164, 59)',
                            }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                            style={{ width: '100%', height: '100%' }}
                            />
                        </div>
                        )}
                    </div>
                    <div className="pt-1">
                    <motion.h3
                        animate={{
                        color: isCurrent || isCompleted ? 'rgb(29, 42, 56)' : 'rgb(156, 163, 175)',
                        }}
                        transition={{ duration: 0.3 }}
                        style={{ fontWeight: 500 }}
                    >
                        {step.title}
                    </motion.h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                </div>
                </div>
            )
            })}
          </div>
        </div>
        <Separator 
        orientation="vertical"
        className="data-[orientation=vertical]:h-1/2"
        />
        <div className="w-full md:w-2/3">
        <AnimatePresence mode="wait">
            <motion.div
            key={currentStep.id}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ padding: '1.5rem' }}
            >
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#1D2A38]">{currentStep.title}</h2>
                <p className="text-gray-600">{currentStep.description}</p>
            </div>
            {/* Render the current step component */}
            {currentStep.component}

            {/* Validation error message */}
            {validationError && (
            <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded-md flex items-start gap-2 text-red-300">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <p>{validationError}</p>
            </div>
            )}
            </motion.div>
        </AnimatePresence>
        </div>
      </div>

        <div className="w-full p-6 flex justify-between">
        <Button
            variant="outline"
            onClick={handleBack}
            disabled={isSubmitting}
            className={cn(
            'border-2 border-gray-300 text-[#1D2A38] hover:bg-gray-100',
            isFirstStep && 'opacity-50 cursor-not-allowed'
            )}
        >
            {isFirstStep ? 'Cancel' : 'Back'}
        </Button>
        <Button onClick={handleNext} disabled={isSubmitting} className="bg-[#CCA43B] hover:bg-[#CCA43B]/90 text-[#1D2A38] font-semibold">
        {isLastStep ? (
            isSubmitting ? (
            <>
                <Loader2 className="animate-spin" />
                Creating...
            </>
            ) : (
            'Complete'
            )
        ) : (
            'Next'
        )}
        {!isLastStep && <ChevronRight className="ml-1 h-4 w-4" />}
        </Button>
        </div>
    </div>
  )
}

export default MultiStepForm
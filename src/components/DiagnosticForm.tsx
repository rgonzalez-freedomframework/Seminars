'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ArrowRight, ArrowLeft, Mail, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

type DiagnosticAnswers = {
  q1: string
  q2: string
  q3: string
  q4: string
  q5: string
  q6: string
  q7: string
  q8: string
  q9: string
  q10: string
  q11: string
}

type QuadrantResult = {
  name: string
  description: string
  primaryFocus: string
  scoreRange: string
  nextSteps: string
}

const questions = {
  section1: {
    title: 'SECTION 1: Time Freedom',
    subtitle: 'Measures how dependent the firm is on the owner\'s daily involvement.',
    questions: [
      {
        id: 'q1',
        text: 'How often are you the decision-maker for operational issues (staffing, deadlines, client exceptions)?',
        options: [
          { value: '1', label: 'Always — everything funnels through me' },
          { value: '2', label: 'Often — my team can handle some, but not most' },
          { value: '3', label: 'Occasionally — key leaders handle the rest' },
          { value: '4', label: 'Rarely — I\'m only looped in for strategic matters' },
        ],
      },
      {
        id: 'q2',
        text: 'How long could your firm operate smoothly without your active involvement?',
        options: [
          { value: '1', label: 'Less than a week' },
          { value: '2', label: '1–2 weeks' },
          { value: '3', label: 'Up to a month' },
          { value: '4', label: '1–3 months or more' },
        ],
      },
      {
        id: 'q3',
        text: 'How much of your week is spent on client work vs. firm leadership?',
        options: [
          { value: '1', label: '80–100% client work' },
          { value: '2', label: '50–79% client work' },
          { value: '3', label: '20–49% client work' },
          { value: '4', label: '<20% client work — primarily leadership' },
        ],
      },
      {
        id: 'q4',
        text: 'How confident are you that your leadership team can handle crises without your intervention?',
        options: [
          { value: '1', label: 'Not confident at all' },
          { value: '2', label: 'Somewhat confident' },
          { value: '3', label: 'Confident' },
          { value: '4', label: 'Completely confident' },
        ],
      },
    ],
  },
  section2: {
    title: 'SECTION 2: Financial Freedom',
    subtitle: 'Measures how consistently the firm generates profit and cash flow.',
    questions: [
      {
        id: 'q5',
        text: 'How predictable is your firm\'s monthly cash flow?',
        options: [
          { value: '1', label: 'Highly unpredictable' },
          { value: '2', label: 'Somewhat consistent' },
          { value: '3', label: 'Predictable with occasional dips' },
          { value: '4', label: 'Highly predictable and steady' },
        ],
      },
      {
        id: 'q6',
        text: 'What best describes your profitability?',
        options: [
          { value: '1', label: 'We\'re busy but margins are thin' },
          { value: '2', label: 'Profitable but inconsistent' },
          { value: '3', label: 'Consistently profitable year-round' },
          { value: '4', label: 'Strong profit margins and recurring revenue streams' },
        ],
      },
      {
        id: 'q7',
        text: 'How closely do you track key financial metrics (AR, utilization, cost per case, etc.)?',
        options: [
          { value: '1', label: 'Rarely' },
          { value: '2', label: 'Monthly or when issues arise' },
          { value: '3', label: 'Weekly or consistently' },
          { value: '4', label: 'Automated dashboards or scorecards' },
        ],
      },
      {
        id: 'q8',
        text: 'How much of your revenue depends directly on your own production?',
        options: [
          { value: '1', label: 'More than 75%' },
          { value: '2', label: '50–74%' },
          { value: '3', label: '25–49%' },
          { value: '4', label: 'Less than 25%' },
        ],
      },
    ],
  },
  section3: {
    title: 'SECTION 3: Leadership & Systems',
    subtitle: 'Measures structure, accountability, and team performance.',
    questions: [
      {
        id: 'q9',
        text: 'How clearly are roles and responsibilities defined in your firm?',
        options: [
          { value: '1', label: 'Everyone wears multiple hats' },
          { value: '2', label: 'Some clarity, but overlap and confusion persist' },
          { value: '3', label: 'Mostly clear with occasional gaps' },
          { value: '4', label: 'Fully documented roles and scorecards' },
        ],
      },
      {
        id: 'q10',
        text: 'How consistently does your team meet expectations without micromanagement?',
        options: [
          { value: '1', label: 'Rarely — I constantly follow up' },
          { value: '2', label: 'Sometimes — depends on who\'s involved' },
          { value: '3', label: 'Usually — we review performance regularly' },
          { value: '4', label: 'Always — accountability is built into the system' },
        ],
      },
      {
        id: 'q11',
        text: 'How scalable are your current processes?',
        options: [
          { value: '1', label: 'Everything lives in people\'s heads' },
          { value: '2', label: 'We have some documentation, but it\'s outdated' },
          { value: '3', label: 'Documented and repeatable processes' },
          { value: '4', label: 'Fully systematized and continuously improved' },
        ],
      },
    ],
  },
}

const quadrants: Record<string, QuadrantResult> = {
  grind: {
    name: 'The Grind Zone',
    description: 'High stress, low freedom — firm fully owner-dependent, inconsistent profit.',
    primaryFocus: 'Predictability + Accountability',
    scoreRange: '11–20',
    nextSteps: 'Focus on building predictable systems and establishing team accountability. Start by documenting your core processes and delegating routine tasks.',
  },
  drift: {
    name: 'The Drift Zone',
    description: 'Stable operations but underperforming profit or growth; comfort replaces ambition.',
    primaryFocus: 'Profit Optimization + Metrics',
    scoreRange: '21–28',
    nextSteps: 'Implement key performance metrics and profit optimization strategies. Review your pricing model and identify opportunities to increase revenue per client.',
  },
  golden: {
    name: 'The Golden Cage',
    description: 'Strong financials but low autonomy; owner still the bottleneck.',
    primaryFocus: 'Leadership + Delegation Systems',
    scoreRange: '29–36',
    nextSteps: 'Develop leadership within your team and create delegation frameworks. Focus on removing yourself from day-to-day operations by empowering key leaders.',
  },
  freedom: {
    name: 'The Freedom Zone',
    description: 'Aligned profit, time, and leadership; firm runs on systems.',
    primaryFocus: 'Continuous Optimization + Autonomy',
    scoreRange: '37–44',
    nextSteps: 'Continue optimizing your systems and exploring growth opportunities. Consider scaling your impact through coaching, acquisitions, or new practice areas.',
  },
}

function calculateQuadrant(score: number): QuadrantResult {
  if (score >= 11 && score <= 20) return quadrants.grind
  if (score >= 21 && score <= 28) return quadrants.drift
  if (score >= 29 && score <= 36) return quadrants.golden
  return quadrants.freedom
}

export function DiagnosticForm({ isModal = false, onClose }: { isModal?: boolean; onClose?: () => void }) {
  const formRef = useRef<HTMLDivElement>(null)
  const [currentSection, setCurrentSection] = useState(1)
  const [answers, setAnswers] = useState<Partial<DiagnosticAnswers>>({})
  const [showEmailCapture, setShowEmailCapture] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Scroll to form on section or view change
  useEffect(() => {
    if (formRef.current) {
      const headerOffset = 100
      const elementPosition = formRef.current.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }, [currentSection, showEmailCapture, showResults])

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const getSectionQuestions = (section: number) => {
    if (section === 1) return questions.section1.questions
    if (section === 2) return questions.section2.questions
    return questions.section3.questions
  }

  const getSectionInfo = (section: number) => {
    if (section === 1) return { title: questions.section1.title, subtitle: questions.section1.subtitle }
    if (section === 2) return { title: questions.section2.title, subtitle: questions.section2.subtitle }
    return { title: questions.section3.title, subtitle: questions.section3.subtitle }
  }

  const isSectionComplete = (section: number) => {
    const sectionQuestions = getSectionQuestions(section)
    return sectionQuestions.every((q) => answers[q.id as keyof DiagnosticAnswers])
  }

  const handleNext = () => {
    if (currentSection < 3) {
      setCurrentSection(currentSection + 1)
    } else {
      setShowEmailCapture(true)
    }
  }

  const handleBack = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1)
    }
  }

  const calculateScore = () => {
    return Object.values(answers).reduce((sum, value) => sum + parseInt(value || '0'), 0)
  }

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const score = calculateScore()
      const quadrant = calculateQuadrant(score)
      
      // TODO: Send to backend API
      console.log('Submitting:', { firstName, lastName, email, score, quadrant: quadrant.name })
      
      // Show results
      setShowResults(true)
    } catch (error) {
      console.error('Error submitting:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const score = calculateScore()
  const quadrant = calculateQuadrant(score)
  const progress = ((currentSection - 1) / 3) * 100

  if (showResults) {
    return (
      <div ref={formRef} className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1D2A38]">Your Results</h2>
          <p className="text-lg text-[#1D2A38]/90">Based on your responses, here's where your firm stands:</p>
        </div>

        <Card className="border-2 border-[#CCA43B] bg-[#F6F7F4] p-8 md:p-10 shadow-xl">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#CCA43B]/20 border-2 border-[#CCA43B]">
              <span className="text-3xl font-bold text-[#CCA43B]">{score}</span>
            </div>
            
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#1D2A38] mb-2">{quadrant.name}</h3>
              <p className="text-sm text-[#1D2A38]/85 uppercase tracking-wider">Score Range: {quadrant.scoreRange}</p>
            </div>
            
            <p className="text-lg text-[#1D2A38]/90 max-w-2xl mx-auto">{quadrant.description}</p>
            
            <div className="pt-6 border-t border-[#1D2A38]/20">
              <h4 className="font-semibold text-[#1D2A38] mb-3">Next Steps:</h4>
              <p className="text-[#1D2A38]/90">{quadrant.nextSteps}</p>
            </div>
          </div>
        </Card>

        <div className="text-center space-y-4">
          <p className="text-lg text-[#1D2A38]/90">
            Ready to move toward freedom?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button className="flex-1 bg-gradient-to-r from-[#CCA43B] to-[#B8932F] hover:from-[#B8932F] hover:to-[#CCA43B] text-white hover:text-white font-bold shadow-lg hover:shadow-xl transition-all">
              Register for Webinar
              <Calendar className="h-4 w-4 ml-2" />
            </Button>
            <Button variant="outline" className="flex-1 border-2 border-[#1D2A38]/40 bg-[#F6F7F4] hover:bg-[#1D2A38]/5 text-[#1D2A38] hover:text-[#1D2A38] font-semibold" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (showEmailCapture) {
    return (
      <div ref={formRef} className="max-w-2xl mx-auto">
        <Card className="border-0 bg-[#F6F7F4] p-8 md:p-10 shadow-lg">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1D2A38]">Get Your Results</h2>
            <p className="text-[#1D2A38]/90">
              Enter your information to receive your Freedom Matrix Diagnostic results
            </p>
          </div>

          <form onSubmit={handleSubmitEmail} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-[#1D2A38]">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="border-[#1D2A38]/40"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-[#1D2A38]">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="border-[#1D2A38]/40"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#1D2A38]">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-[#1D2A38]/40"
                placeholder="you@lawfirm.com"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEmailCapture(false)}
                className="flex-1 border-2 border-[#1D2A38]/40 bg-[#F6F7F4] hover:bg-[#1D2A38]/5 text-[#1D2A38] hover:text-[#1D2A38] font-semibold"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-[#CCA43B] to-[#B8932F] hover:from-[#B8932F] hover:to-[#CCA43B] text-white hover:text-white font-bold shadow-lg hover:shadow-xl transition-all"
              >
                {isSubmitting ? 'Submitting...' : 'Get My Results'}
                <Mail className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </form>
        </Card>
      </div>
    )
  }

  const sectionInfo = getSectionInfo(currentSection)
  const sectionQuestions = getSectionQuestions(currentSection)

  return (
    <div ref={formRef} className="max-w-4xl mx-auto space-y-8">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-[#1D2A38]/90">
          <span>Section {currentSection} of 3</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="h-2 bg-[#1D2A38]/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#CCA43B] to-[#B8932F] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Section Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1D2A38]">{sectionInfo.title}</h2>
        <p className="text-[#1D2A38]/90 max-w-2xl mx-auto">{sectionInfo.subtitle}</p>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {sectionQuestions.map((question, index) => (
          <Card key={question.id} className="border-0 bg-[#F6F7F4] p-6 md:p-8 shadow-lg">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#1D2A38]">
                {index + 1 + (currentSection - 1) * 4}. {question.text}
              </h3>
              <RadioGroup
                value={answers[question.id as keyof DiagnosticAnswers] || ''}
                onValueChange={(value) => handleAnswer(question.id, value)}
              >
                <div className="space-y-3">
                  {question.options.map((option) => {
                    const isSelected = answers[question.id as keyof DiagnosticAnswers] === option.value
                    return (
                    <div
                      key={option.value}
                      onClick={() => handleAnswer(question.id, option.value)}
                      className={cn(
                        "flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer",
                        isSelected 
                          ? "border-[#CCA43B] bg-[#CCA43B]/10 shadow-md" 
                          : "border-[#1D2A38]/30 hover:border-[#CCA43B]/50 hover:bg-[#CCA43B]/5 hover:shadow-sm"
                      )}
                    >
                      <RadioGroupItem 
                        value={option.value} 
                        id={`${question.id}-${option.value}`} 
                        className="mt-0.5 border-[#1D2A38]/40 data-[state=checked]:border-[#CCA43B] data-[state=checked]:bg-[#CCA43B]/10 pointer-events-none"
                      />
                      <Label
                        htmlFor={`${question.id}-${option.value}`}
                        className="flex-1 cursor-pointer text-[#1D2A38]/90 leading-relaxed pointer-events-none"
                      >
                        {option.label}
                      </Label>
                    </div>
                  )})}
                </div>
              </RadioGroup>
            </div>
          </Card>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        {currentSection > 1 && (
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex-1 border-2 border-[#1D2A38]/40 bg-[#F6F7F4] hover:bg-[#1D2A38]/5 text-[#1D2A38] hover:text-[#1D2A38] font-semibold"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous Section
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={!isSectionComplete(currentSection)}
          className="flex-1 bg-gradient-to-r from-[#CCA43B] to-[#B8932F] hover:from-[#B8932F] hover:to-[#CCA43B] text-white hover:text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentSection === 3 ? 'Complete Diagnostic' : 'Next Section'}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}


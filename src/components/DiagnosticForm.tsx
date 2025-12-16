'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
  deepTitle: string
  deepBody: string
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
    deepTitle: 'Deeper Insight into The Grind Zone',
    deepBody:
      'In the Grind Zone, you and your firm are running on sheer effort rather than structure. Revenue may be coming in, but it feels fragile because so much depends on you personally showing up, deciding, and doing. This is where long hours, constant firefighting, and decision fatigue become normal. Team members look to you for answers because the systems, scorecards, and expectations they would rely on simply are not strong enough yet. The risk is that you normalize chaos as “just how it is” in a growing firm. Your biggest unlock here is to slow down long enough to build predictability: document a few core processes, define ownership, and install simple, visible metrics so the firm can start to perform without you carrying all the weight.',
  },
  drift: {
    name: 'The Drift Zone',
    description: 'Stable operations but underperforming profit or growth; comfort replaces ambition.',
    primaryFocus: 'Profit Optimization + Metrics',
    scoreRange: '21–28',
    nextSteps: 'Implement key performance metrics and profit optimization strategies. Review your pricing model and identify opportunities to increase revenue per client.',
    deepTitle: 'Deeper Insight into The Drift Zone',
    deepBody:
      'In the Drift Zone, the firm is “fine” on the surface — cases are handled, the team more or less knows what to do, and cash flow is not an emergency. But underneath, the numbers are not where they could be, and growth has quietly stalled. Comfort becomes the enemy: because nothing is on fire, there is no urgency to optimize pricing, tighten margins, or pursue higher‑value matters. The danger is that years pass while you work hard in a business that never quite delivers the lifestyle, freedom, or valuation you envisioned. The shift here is to treat your firm like an asset you are tuning, not just a job you are maintaining: install clear financial scorecards, set bolder targets, and intentionally design profit into every part of your model.',
  },
  golden: {
    name: 'The Golden Cage',
    description: 'Strong financials but low autonomy; owner still the bottleneck.',
    primaryFocus: 'Leadership + Delegation Systems',
    scoreRange: '29–36',
    nextSteps: 'Develop leadership within your team and create delegation frameworks. Focus on removing yourself from day-to-day operations by empowering key leaders.',
    deepTitle: 'Deeper Insight into The Golden Cage',
    deepBody:
      'In the Golden Cage, the firm looks successful from the outside: strong revenue, healthy profit, a reputation you have worked years to build. The problem is that your personal time and identity are still trapped inside the machine you created. You are the rainmaker, the quality control, the backstop for tough decisions. The cage is “golden” because the money is good — but the trade‑off is that you cannot step away without fearing that things will slow down, break, or decline. Moving forward means deliberately breaking the belief that you must be at the center of everything. This is the season to build leaders, not just staff; to create decision‑making frameworks; and to accept that empowering others will feel uncomfortable before it feels freeing.',
  },
  freedom: {
    name: 'The Freedom Zone',
    description: 'Aligned profit, time, and leadership; firm runs on systems.',
    primaryFocus: 'Continuous Optimization + Autonomy',
    scoreRange: '37–44',
    nextSteps: 'Continue optimizing your systems and exploring growth opportunities. Consider scaling your impact through coaching, acquisitions, or new practice areas.',
    deepTitle: 'Deeper Insight into The Freedom Zone',
    deepBody:
      'In the Freedom Zone, your firm runs on intentional design rather than heroic effort. Profit, time, and leadership are aligned: the business generates healthy returns, your calendar has margin, and your team can execute without you as the constant linchpin. At this stage, your role shifts from operator to architect and investor — you are deciding what to build next, not just keeping what you have alive. The opportunity here is to protect what you have created while thoughtfully expanding your impact: new markets, new practices, strategic hires, or even advisory and acquisition opportunities. Your work now is less about fixing weaknesses and more about compounding strengths while staying true to the lifestyle and freedom that matter most to you.',
  },
}

function calculateQuadrant(score: number): QuadrantResult {
  if (score >= 11 && score <= 20) return quadrants.grind
  if (score >= 21 && score <= 28) return quadrants.drift
  if (score >= 29 && score <= 36) return quadrants.golden
  return quadrants.freedom
}

export function DiagnosticForm({ isModal = false, onClose }: { isModal?: boolean; onClose?: () => void }) {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Partial<DiagnosticAnswers>>({})
  const [showEmailCapture, setShowEmailCapture] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get all questions in order
  const allQuestions = [
    ...questions.section1.questions,
    ...questions.section2.questions,
    ...questions.section3.questions,
  ]

  const currentQuestion = allQuestions[currentQuestionIndex]
  const totalQuestions = allQuestions.length
  const progress = ((currentQuestionIndex) / totalQuestions) * 100

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const getCurrentSection = () => {
    if (currentQuestionIndex < 4) return 1
    if (currentQuestionIndex < 8) return 2
    return 3
  }

  const getSectionInfo = (section: number) => {
    if (section === 1) return { title: questions.section1.title, subtitle: questions.section1.subtitle }
    if (section === 2) return { title: questions.section2.title, subtitle: questions.section2.subtitle }
    return { title: questions.section3.title, subtitle: questions.section3.subtitle }
  }

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setShowEmailCapture(true)
    }
  }

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const isQuestionAnswered = () => {
    return !!answers[currentQuestion.id as keyof DiagnosticAnswers]
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
  const currentSection = getCurrentSection()
  const sectionInfo = getSectionInfo(currentSection)

  const handleClose = () => {
    if (onClose) {
      onClose()
    } else {
      router.push('/')
    }
  }

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
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

            <div className="pt-8 border-t border-dashed border-[#1D2A38]/20 text-left max-w-3xl mx-auto">
              <h4 className="font-semibold text-[#1D2A38] mb-3 text-base md:text-lg">
                {quadrant.deepTitle}
              </h4>
              <p className="text-sm md:text-base leading-relaxed text-[#1D2A38]/90 whitespace-pre-line">
                {quadrant.deepBody}
              </p>
            </div>
          </div>
        </Card>

        <div className="text-center space-y-4">
          <p className="text-lg text-[#1D2A38]/90">
            Ready to move toward freedom?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link href="/sign-up" className="flex-1">
              <Button className="w-full bg-gradient-to-r from-[#CCA43B] to-[#B8932F] hover:from-[#B8932F] hover:to-[#CCA43B] text-white hover:text-white font-bold shadow-lg hover:shadow-xl transition-all">
                Register for Webinar
                <Calendar className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Button
              variant="outline"
              className="flex-1 !border-2 !border-[#1D2A38] !bg-[#F6F7F4] hover:!bg-[#1D2A38]/5 text-[#1D2A38] hover:text-[#1D2A38] font-semibold"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (showEmailCapture) {
    return (
      <div className="max-w-2xl mx-auto">
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
                  className="border-[#1D2A38]/40 bg-white text-[#1D2A38] placeholder:text-[#1D2A38]/60"
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
                  className="border-[#1D2A38]/40 bg-white text-[#1D2A38] placeholder:text-[#1D2A38]/60"
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
                className="border-[#1D2A38]/40 bg-white text-[#1D2A38] placeholder:text-[#1D2A38]/60"
                placeholder="you@lawfirm.com"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEmailCapture(false)}
                className="flex-1 !border-2 !border-[#1D2A38] !bg-[#F6F7F4] hover:!bg-[#1D2A38]/5 text-[#1D2A38] hover:text-[#1D2A38] font-semibold"
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

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="space-y-2 mb-8">
        <div className="flex justify-between text-sm text-[#1D2A38]/90">
          <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
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
      <div className="text-center space-y-2 mb-8">
        <p className="text-sm text-[#CCA43B] font-semibold uppercase tracking-wider">
          Section {currentSection} of 3
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-[#1D2A38]">{sectionInfo.title}</h2>
        <p className="text-[#1D2A38]/90 max-w-2xl mx-auto">{sectionInfo.subtitle}</p>
      </div>

      {/* Single Question with Animation */}
      <div className="animate-in fade-in slide-in-from-right-4 duration-500">
        <Card className="border-0 bg-[#F6F7F4] p-6 md:p-10 shadow-lg">
          <div className="space-y-6">
            <h3 className="text-xl md:text-2xl font-semibold text-[#1D2A38]">
              {currentQuestion.text}
            </h3>
            <RadioGroup
              value={answers[currentQuestion.id as keyof DiagnosticAnswers] || ''}
              onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
            >
              <div className="space-y-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = answers[currentQuestion.id as keyof DiagnosticAnswers] === option.value
                  return (
                  <div
                    key={option.value}
                    onClick={() => handleAnswer(currentQuestion.id, option.value)}
                    className={cn(
                      "flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer",
                      isSelected 
                        ? "border-[#CCA43B] bg-[#CCA43B]/10 shadow-md" 
                        : "border-[#1D2A38]/30 hover:border-[#CCA43B]/50 hover:bg-[#CCA43B]/5 hover:shadow-sm"
                    )}
                  >
                    <RadioGroupItem 
                      value={option.value} 
                      id={`${currentQuestion.id}-${option.value}`} 
                      className="mt-0.5 border-[#1D2A38]/40 data-[state=checked]:border-[#CCA43B] data-[state=checked]:bg-[#CCA43B]/10 pointer-events-none"
                    />
                    <Label
                      htmlFor={`${currentQuestion.id}-${option.value}`}
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
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mt-8">
        {currentQuestionIndex > 0 && (
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex-1 !border-2 !border-[#1D2A38] !bg-[#F6F7F4] hover:!bg-[#1D2A38]/5 text-[#1D2A38] hover:text-[#1D2A38] font-semibold"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={!isQuestionAnswered()}
          className={cn(
            "flex-1 bg-gradient-to-r from-[#CCA43B] to-[#B8932F] hover:from-[#B8932F] hover:to-[#CCA43B] text-white hover:text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed",
            currentQuestionIndex === 0 && "w-full"
          )}
        >
          {currentQuestionIndex === totalQuestions - 1 ? 'Complete Diagnostic' : 'Next Question'}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}


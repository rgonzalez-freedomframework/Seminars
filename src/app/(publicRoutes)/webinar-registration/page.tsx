 'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ArrowRight, CheckCircle2, Sparkles, Gift, Calendar, Clock, Loader2 } from 'lucide-react'
import { registerAttendee } from '@/actions/attendance'
import { toast } from 'sonner'
import RevealOnScroll from '@/components/RevealOnScroll'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

type NextWebinar = {
  id: string
  title: string
  description: string | null
  startTime: string
  duration: number | null
}

type AvailableWebinar = {
  id: string
  title: string
  description: string | null
  startTime: string
  duration: number | null
}

type TopicGroup = {
  title: string
  items: AvailableWebinar[]
}

const formatLocalDateTime = (value: string | Date) => {
  const date = value instanceof Date ? value : new Date(value)
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  const dateLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
    timeZoneName: 'short',
  }).format(date)

  return dateLabel
}

export default function WebinarRegistration() {
  const [nextWebinar, setNextWebinar] = useState<NextWebinar | null>(null)
  const [isLoadingWebinar, setIsLoadingWebinar] = useState(false)

  useEffect(() => {
    const fetchNext = async () => {
      try {
        setIsLoadingWebinar(true)
        const res = await fetch('/api/webinars/next')
        if (!res.ok) return
        const data = await res.json()
        if (data?.success && data.webinar) {
          setNextWebinar(data.webinar)
        }
      } catch (error) {
        console.error('Failed to load next webinar', error)
      } finally {
        setIsLoadingWebinar(false)
      }
    }

    fetchNext()
  }, [])

  const nextWebinarTimeLabel = useMemo(() => {
    if (!nextWebinar?.startTime) return null
    return formatLocalDateTime(nextWebinar.startTime)
  }, [nextWebinar?.startTime])

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#F6F7F4]"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      
      {/* Header with Login Button */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F6F7F4] backdrop-blur-sm border-b border-[#CCA43B]/20 transition-all duration-300" >
        <div className="container mx-auto px-4 py-3 md:py-4 transition-all duration-300">
          <div className="flex justify-between items-center">
            <Link href="/webinar-registration" className="text-xl md:text-2xl font-bold text-[#1D2A38] hover:text-[#CCA43B] transition-colors">
              Freedom Framework™
            </Link>
            <div className="flex items-center gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    variant="outline"
                    className="!border !border-[#1D2A38]/25 !bg-white/80 !text-[#1D2A38] hover:!bg-[#CCA43B]/15 hover:!border-[#CCA43B]/60 font-semibold px-4 py-2 md:px-5 md:py-2.5 shadow-sm"
                  >
                    View Upcoming Webinar Dates
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#F6F7F4] border-[#CCA43B]/40 max-w-xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-[#1D2A38]">
                      Upcoming Webinar Dates
                    </DialogTitle>
                  </DialogHeader>

                  <WebinarDatesModalContent />
                </DialogContent>
              </Dialog>
              <Link href="/sign-in">
                <Button size="lg" variant="outline" className="!border-2 !border-[#1D2A38]/40 !text-[#1D2A38] !bg-[#F6F7F4] hover:!bg-[#CCA43B]/20 font-semibold px-4 py-2 md:px-6 md:py-3 transition-all" >
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 pb-20 relative z-10">
        <div className="container mx-auto px-4 max-w-6xl space-y-16">
          
          {/* Hero Section */}
          <RevealOnScroll glow>
            <section className="relative overflow-hidden rounded-3xl border border-[#CCA43B]/50 bg-[#F6F7F4] backdrop-blur-md px-6 py-10 md:px-10 md:py-14 shadow-lg animate-in fade-in slide-in-from-bottom duration-700">

              <div className="relative text-center space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full bg-[#1D2A38] text-xs md:text-sm font-semibold tracking-[0.18em] text-white px-4 py-1 uppercase">
                <Sparkles className="h-3 w-3 text-[#CCA43B]" />
                Free 2-Hour Masterclass
              </p>
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#1D2A38] leading-tight">
                Your Journey to Freedom: Reclaiming Time, Profit, and Purpose in a Growing Law Firm
              </h1>
              
              <p className="text-lg md:text-xl text-[#1D2A38]/90">
                A Free 2-Hour Masterclass for Law Firm Owners Generating $2M+
              </p>
              
              <p className="text-base md:text-lg text-[#1D2A38]/90 max-w-3xl mx-auto">
                Unlock the three operational shifts that allow 7- and 8-figure firms to scale profitably without tying the owner's life to the business.
              </p>
              
              <div className="bg-[#F6F7F4] backdrop-blur-sm rounded-2xl p-4 inline-block">
                <p className="text-sm md:text-base text-[#1D2A38]/90 mb-3 flex items-start gap-2">
                  <Gift className="h-5 w-5 text-[#CCA43B] flex-shrink-0 mt-0.5" />
                  Start with a short Freedom Matrix Diagnostic™ so you know exactly where your firm stands before the masterclass.
                </p>
              </div>

              {nextWebinarTimeLabel && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white border border-[#CCA43B]/40 px-4 py-2 text-sm font-semibold text-[#1D2A38] shadow-sm">
                  <Calendar className="h-4 w-4 text-[#CCA43B]" />
                  <span>{nextWebinarTimeLabel}</span>
                  {nextWebinar?.duration ? (
                    <>
                      <span className="mx-1 text-[#CCA43B]">•</span>
                      <Clock className="h-4 w-4 text-[#CCA43B]" />
                      <span>{nextWebinar.duration} min</span>
                    </>
                  ) : null}
                </div>
              )}

              <div className="flex justify-center">
                <Link href="https://www.freedomframework.us/diagnostic">
                  <Button className="bg-gradient-to-r from-[#CCA43B] to-[#B8932F] hover:from-[#B8932F] hover:to-[#CCA43B] text-white font-bold px-8 py-4 text-lg rounded-xl border-2 border-[#CCA43B] transition-all flex items-center gap-2" >
                    Take Assessment & Register — Free
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
              </div>
            </section>
          </RevealOnScroll>

          {/* Why This Training is Different */}
          <RevealOnScroll glow>
          <section className="rounded-3xl border border-[#CCA43B]/50 bg-[#F6F7F4] backdrop-blur-md p-6 md:p-8 shadow-lg animate-in fade-in slide-in-from-bottom duration-700">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1D2A38] mb-4">Why This Training Is Different (And Why You Need the Diagnostic)</h2>
            
            <p className="text-[#1D2A38]/90 mb-4 text-lg">
              Most successful law firm owners don't have a strategy problem — they have a <span className="text-[#CCA43B] font-semibold">visibility problem</span>.
            </p>
            
            <p className="text-[#1D2A38]/90 mb-6">
              They don't know exactly where their firm sits on the Freedom Matrix™, or which operational bottlenecks are silently holding them back.
            </p>

            <div className="bg-[#F6F7F4] rounded-2xl border border-[#CCA43B]/40 p-6 md:p-8">
              <div className="flex items-start gap-3 mb-4">
                <Gift className="h-6 w-6 text-[#CCA43B] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-[#1D2A38] mb-2">Your Freedom Matrix Diagnostic™</h3>
                  <p className="text-[#1D2A38]/90 mb-3">A 5-minute assessment that identifies your firm's exact quadrant:</p>
                </div>
              </div>

              <ul className="space-y-2 text-[#1D2A38]/90 mb-4 ml-9">
                <li>• The Grind Zone</li>
                <li>• The Drift Zone</li>
                <li>• The Golden Cage</li>
                <li>• The Freedom Zone</li>
              </ul>

              <p className="text-[#1D2A38]/90 font-semibold mb-3 ml-9">Your result includes:</p>
              <ul className="space-y-2 text-[#1D2A38]/90 ml-9">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-1 text-[#CCA43B] flex-shrink-0" />
                  <span>A detailed explanation of your quadrant</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-1 text-[#CCA43B] flex-shrink-0" />
                  <span>The operational weaknesses typical for that zone</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-1 text-[#CCA43B] flex-shrink-0" />
                  <span>Your greatest point of leverage for immediate improvement</span>
                </li>
              </ul>

              <p className="text-[#1D2A38]/90 italic mt-4 ml-9">Your score and quadrant summary appear on screen as soon as you complete the assessment.</p>
            </div>
          </section>
          </RevealOnScroll>

          {/* What You'll Learn */}
          <section className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1D2A38] text-center">WHAT YOU’LL LEARN DURING THE FREE 2-HOUR MASTERCLASS</h2>
            <p className="text-[#1D2A38]/90 text-center mb-8">This masterclass will give you clarity on:</p>

            <div className="grid gap-6 md:gap-8 md:grid-cols-2">
              <RevealOnScroll glow>
              <article className="h-full flex flex-col rounded-3xl border border-[#1D2A38]/40 bg-[#F6F7F4] backdrop-blur-md p-6 md:p-7 shadow-lg hover:shadow-xl transition-all" >
                <h3 className="text-lg md:text-xl font-semibold text-[#1D2A38] mb-3">1. The Freedom Matrix™</h3>
                <p className="text-[#1D2A38]/90 mb-3">
                  How to diagnose exactly what's limiting your firm's ability to scale without consuming you.
                </p>
                <p className="text-[#1D2A38]/90 mb-2">You'll understand the difference between:</p>
                <ul className="space-y-2 text-[#1D2A38]/90 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-[#CCA43B] flex-shrink-0" />
                    <span>Money freedom vs. time freedom</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-[#CCA43B] flex-shrink-0" />
                    <span>Growth vs. owner dependency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-[#CCA43B] flex-shrink-0" />
                    <span>Revenue vs. operational design</span>
                  </li>
                </ul>
              </article>
              </RevealOnScroll>

              <RevealOnScroll glow>
              <article className="h-full flex flex-col rounded-3xl border border-[#1D2A38]/40 bg-[#F6F7F4] backdrop-blur-md p-6 md:p-7 shadow-lg hover:shadow-xl transition-all" >
                <h3 className="text-lg md:text-xl font-semibold text-[#1D2A38] mb-3">2. The Hidden Traps of Hourly, Flat-Fee, and Contingency Models</h3>
                <p className="text-[#1D2A38]/90 mb-3">Every billing model contains a built-in freedom trap.</p>
                <p className="text-[#1D2A38]/90 mb-2">You'll learn:</p>
                <ul className="space-y-2 text-[#1D2A38]/90 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-[#CCA43B] flex-shrink-0" />
                    <span>Why hourly firms get stuck in utilization overload</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-[#CCA43B] flex-shrink-0" />
                    <span>Why flat-fee firms lose profit through scope creep</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-[#CCA43B] flex-shrink-0" />
                    <span>Why contingency firms live in volatility</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-[#CCA43B] flex-shrink-0" />
                    <span>How to escape these traps without sacrificing performance</span>
                  </li>
                </ul>
              </article>
              </RevealOnScroll>

              <RevealOnScroll glow>
              <article className="h-full flex flex-col rounded-3xl border border-[#1D2A38]/40 bg-[#F6F7F4] backdrop-blur-md p-6 md:p-7 shadow-lg hover:shadow-xl transition-all" >
                <h3 className="text-lg md:text-xl font-semibold text-[#1D2A38] mb-3">3. The Three Operational Shifts</h3>
                <p className="text-[#1D2A38]/90 mb-3">The exact systems used by thriving firms in the Freedom Zone:</p>
                <ul className="space-y-2 text-[#1D2A38]/90 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-[#CCA43B] flex-shrink-0" />
                    <span>The Accountability Shift — Your team owns outcomes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-[#CCA43B] flex-shrink-0" />
                    <span>The Predictability Shift — Your metrics give you control</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-[#CCA43B] flex-shrink-0" />
                    <span>The Autonomy Shift — Your firm runs without you</span>
                  </li>
                </ul>
              </article>
              </RevealOnScroll>

              <RevealOnScroll glow>
              <article className="h-full flex flex-col rounded-3xl border border-[#1D2A38]/40 bg-[#F6F7F4] backdrop-blur-md p-6 md:p-7 shadow-lg hover:shadow-xl transition-all" >
                <h3 className="text-lg md:text-xl font-semibold text-[#1D2A38] mb-3">4. How High-Performing Firms Scale Without Sacrifice</h3>
                <p className="text-[#1D2A38]/90 mb-3">You'll see how these shifts create:</p>
                <ul className="space-y-2 text-[#1D2A38]/90 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-[#CCA43B] flex-shrink-0" />
                    <span>Better profit margins</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-[#CCA43B] flex-shrink-0" />
                    <span>Stronger leadership</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-[#CCA43B] flex-shrink-0" />
                    <span>Reduced owner involvement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-[#CCA43B] flex-shrink-0" />
                    <span>A business that serves your life, not the other way around</span>
                  </li>
                </ul>
              </article>
              </RevealOnScroll>
            </div>
          </section>

          {/* What You Receive */}
          <section className="rounded-3xl border border-[#CCA43B]/40 bg-[#F6F7F4] backdrop-blur-md text-[#1D2A38] px-6 py-8 md:px-10 md:py-10 shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">What You Receive When You Register</h2>
            <p className="text-[#1D2A38]/90 mb-6 text-center">You get immediate access to:</p>

            <div className="grid gap-4 md:gap-6 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <Gift className="h-6 w-6 text-[#CCA43B] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold mb-1">1. Your Freedom Matrix Diagnostic™</p>
                  <p className="text-sm text-[#1D2A38]/90">A concise snapshot of your firm's quadrant and key leverage points, shown immediately after you complete the assessment.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Gift className="h-6 w-6 text-[#CCA43B] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold mb-1">2. The Operational Freedom Scorecard</p>
                  <p className="text-sm text-[#1D2A38]/90">A simple tool to identify time + money leaks in your firm. (Delivered after the webinar.)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Gift className="h-6 w-6 text-[#CCA43B] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold mb-1">3. Access to the 2-hour masterclass</p>
                  <p className="text-sm text-[#1D2A38]/90">Plus the replay for internal leadership training.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Gift className="h-6 w-6 text-[#CCA43B] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold mb-1">4. A private invitation to our next advanced workshop</p>
                  <p className="text-sm text-[#1D2A38]/90">Optional, for owners who want deeper implementation support.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Who This Is For */}
          <section className="grid gap-8 md:grid-cols-2 items-stretch">
            <RevealOnScroll glow>
            <div className="h-full flex flex-col rounded-3xl border border-[#1D2A38]/40 bg-[#F6F7F4] backdrop-blur-md p-6 md:p-8 shadow-md">
              <h2 className="text-2xl md:text-3xl font-bold text-[#1D2A38] mb-4">Who This Masterclass Is For</h2>
              <p className="text-[#1D2A38]/90 mb-4">This training is specifically for:</p>
              <ul className="space-y-3 text-[#1D2A38]/90">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-1 text-[#CCA43B] flex-shrink-0" />
                  <span>Owners of law firms generating $2M–$20M+</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-1 text-[#CCA43B] flex-shrink-0" />
                  <span>Founders tired of being the bottleneck</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-1 text-[#CCA43B] flex-shrink-0" />
                  <span>Firms with inconsistent profitability despite high revenue</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-1 text-[#CCA43B] flex-shrink-0" />
                  <span>Owners who want more time freedom without reducing performance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-1 text-[#CCA43B] flex-shrink-0" />
                  <span>Leaders ready to build systems, not stress</span>
                </li>
              </ul>
              <p className="text-[#1D2A38]/90 mt-5 font-semibold">
                If your firm is too big to operate on hustle — but too owner-dependent to feel free — this session is for you.
              </p>
            </div>
            </RevealOnScroll>

            <RevealOnScroll glow>
            <div className="h-full flex flex-col rounded-3xl border border-[#1D2A38]/40 bg-[#F6F7F4] backdrop-blur-md p-6 md:p-8 shadow-md">
              <h2 className="text-2xl md:text-3xl font-bold text-[#1D2A38] mb-4">About Your Instructor</h2>
              <h3 className="text-xl font-semibold text-[#1D2A38] mb-2">Janelle Sam, MBA (Cornell)</h3>
              <p className="text-[#1D2A38]/90 mb-3">
                Advisor to hundreds of law firm owners and creator of the Freedom Framework™, a strategic operating system designed to help firms scale profitably and autonomously.
              </p>
              <p className="text-[#1D2A38]/90 mb-3">
                Janelle has helped firms reduce owner dependency, double profitability, build leadership teams, and navigate the complexity of scaling from $2M to $20M+.
              </p>
              <p className="text-[#1D2A38]/90 italic">
                She created this masterclass because success without freedom isn't success — it's a more expensive form of burnout.
              </p>
            </div>
            </RevealOnScroll>
          </section>

          {/* Event Details - temporarily removed */}

          {/* FAQ */}
          <section className="space-y-6">
            <RevealOnScroll glow>
              <div className="max-w-6xl mx-auto">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="faq-root">
                    <AccordionTrigger className="justify-center text-center text-lg md:text-xl font-bold text-white rounded-3xl border border-[#1D2A38]/40 bg-gradient-to-r from-[#CCA43B] to-[#B8932F] px-4 py-3 md:px-6 md:py-4 shadow-sm">
                      Frequently Asked Questions
                    </AccordionTrigger>
                    <AccordionContent className="pt-3 md:pt-4">
                      <div className="rounded-3xl p-4 md:p-6">
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="recording">
                            <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-[#1D2A38]">
                              Will this training be recorded?
                            </AccordionTrigger>
                            <AccordionContent className="text-sm md:text-base text-[#1D2A38]/90">
                              Yes — registrants will receive the replay link.
                            </AccordionContent>
                          </AccordionItem>

                          <AccordionItem value="firm-size">
                            <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-[#1D2A38]">
                              Is this for small or new firms?
                            </AccordionTrigger>
                            <AccordionContent className="text-sm md:text-base text-[#1D2A38]/90">
                              No — the content in this webinar would be challenging for a firm that does not have admin support in operations to implement. This is recommended for firms that have generated at least $2M+ in annual revenue.
                            </AccordionContent>
                          </AccordionItem>

                          <AccordionItem value="diagnostic">
                            <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-[#1D2A38]">
                              How will I get my diagnostic results?
                            </AccordionTrigger>
                            <AccordionContent className="text-sm md:text-base text-[#1D2A38]/90">
                              After you complete the assessment, your Freedom Matrix Diagnostic summary appears immediately on screen so you can review your results right away.
                            </AccordionContent>
                          </AccordionItem>

                          <AccordionItem value="sales">
                            <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-[#1D2A38]">
                              Is this a sales webinar?
                            </AccordionTrigger>
                            <AccordionContent className="text-sm md:text-base text-[#1D2A38]/90">
                              The training is 100% valuable on its own. At the end, you&apos;ll hear about the Freedom Framework™ 12-month program, but there is zero pressure to join.
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </RevealOnScroll>
          </section>

          {/* Final CTA */}
          <RevealOnScroll glow>
          <section className="rounded-3xl border border-[#CCA43B]/50 bg-[#F6F7F4] backdrop-blur-md px-6 py-10 md:px-10 md:py-12 text-center shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1D2A38] mb-4">Ready to Discover Your Path to Freedom?</h2>
            <p className="text-[#1D2A38]/90 mb-6 max-w-2xl mx-auto text-base md:text-lg">
              If you want a law firm that scales profitably and gives you back your life… start by learning where your firm stands today.
            </p>
            <p className="text-[#1D2A38]/90 mb-8 max-w-2xl mx-auto">
              Reserve your seat, then complete the short assessment to see exactly where you are on the Freedom Matrix before we meet live.
            </p>
            <Link href="https://www.freedomframework.us/diagnostic">
              <Button className="bg-gradient-to-r from-[#CCA43B] to-[#B8932F] hover:from-[#B8932F] hover:to-[#CCA43B] text-white font-bold px-10 py-4 text-lg rounded-xl border-2 border-[#CCA43B] transition-all inline-flex items-center gap-2" >
                Take Assessment & Register — Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </section>
          </RevealOnScroll>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 md:py-12 border-t border-[#1D2A38]/40 bg-[#F6F7F4]/50 backdrop-blur-sm relative z-10 shadow-sm">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[#1D2A38]/90 mb-2">
            Freedom Framework™ for Law Firm Owners
          </p>
          <p className="text-[#1D2A38]/60 text-sm">
            © 2025 All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}

type WebinarDatesModalState = 1 | 2 | 3

function WebinarDatesModalContent() {
  const [step, setStep] = useState<WebinarDatesModalState>(1)
  const [availableWebinars, setAvailableWebinars] = useState<AvailableWebinar[]>([])
  const [isLoadingWebinars, setIsLoadingWebinars] = useState(false)
  const [selectedWebinarId, setSelectedWebinarId] = useState<string | null>(null)
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null)
  const [selectedDateLabel, setSelectedDateLabel] = useState<string | null>(null)
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [situation, setSituation] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchAvailable = async () => {
      try {
        setIsLoadingWebinars(true)
        const res = await fetch('/api/webinars/available')
        if (!res.ok) return
        const data = await res.json()
        if (data?.success && Array.isArray(data.webinars)) {
          setAvailableWebinars(data.webinars)
        }
      } catch (error) {
        console.error('Failed to load available webinars', error)
      } finally {
        setIsLoadingWebinars(false)
      }
    }

    fetchAvailable()
  }, [])

  const topicGroups: TopicGroup[] = useMemo(() => {
    const groupsMap = new Map<string, AvailableWebinar[]>()

    for (const webinar of availableWebinars) {
      const key = webinar.title || 'Upcoming Webinar'
      const existing = groupsMap.get(key) ?? []
      existing.push(webinar)
      groupsMap.set(key, existing)
    }

    return Array.from(groupsMap.entries()).map(([title, items]) => ({ title, items }))
  }, [availableWebinars])

  const canContinueFromStep1 = !!selectedWebinarId
  const canSubmitStep2 = firstName.trim().length > 0 && email.trim().length > 0 && !!selectedWebinarId

  const handleReset = () => {
    setStep(1)
    setSelectedWebinarId(null)
    setSelectedTitle(null)
    setSelectedDateLabel(null)
    setFirstName('')
    setEmail('')
    setSituation('')
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!canSubmitStep2 || !selectedWebinarId) return

    try {
      setIsSubmitting(true)
      const res = await registerAttendee({
        webinarId: selectedWebinarId,
        email,
        name: firstName,
        description: situation || undefined,
        phone: undefined,
        businessName: undefined,
        userId: undefined,
      })

      if (!res?.success) {
        const message = res?.message || 'Something went wrong'
        toast.error(message)
        return
      }

      toast.success(res.message || 'You are registered for this webinar')
      setStep(3)
    } catch (error) {
      console.error('Error submitting webinar registration:', error)
      toast.error('Something went wrong while saving your spot')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (step === 3) {
    return (
      <div className="space-y-4">
        <p className="text-sm md:text-base text-[#1D2A38]/90">
          You&apos;re all set for the webinar.
        </p>
        <p className="text-sm md:text-base text-[#1D2A38]/90">
          Want a personalized recommendation for your firm?
        </p>
        <div className="space-y-3">
          <p className="text-sm md:text-base font-semibold text-[#1D2A38]">
            Take the 2-minute assessment to see exactly where your firm sits on the Freedom Matrix™.
          </p>
          <Link href="https://www.freedomframework.us/diagnostic" target="_blank" rel="noreferrer">
            <Button className="bg-gradient-to-r from-[#CCA43B] to-[#B8932F] hover:from-[#B8932F] hover:to-[#CCA43B] text-white font-semibold px-6 py-3 rounded-lg border-2 border-[#CCA43B] w-full md:w-auto">
              Take the 2-minute assessment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="mt-2 text-xs text-[#1D2A38]/70 underline-offset-4 hover:underline"
        >
          Choose a different topic or date
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Step 1: Topic + Date */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-[0.16em] text-[#1D2A38] uppercase">
              Step 1
            </p>
            <h3 className="text-base md:text-lg font-semibold text-[#1D2A38]">
              Choose your webinar topic and date
            </h3>
          </div>
          {isLoadingWebinars ? (
            <div className="flex items-center gap-2 text-sm text-[#1D2A38]/80">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading upcoming webinar dates...
            </div>
          ) : topicGroups.length === 0 ? (
            <p className="text-sm text-[#1D2A38]/80">
              No upcoming webinars are available right now. Please check back soon.
            </p>
          ) : (
            <div className="space-y-4">
              {topicGroups.map((group) => (
                <div
                  key={group.title}
                  className="rounded-2xl border px-4 py-3 bg-white/70 border-[#1D2A38]/15"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="font-semibold text-sm md:text-base text-[#1D2A38]">
                      {group.title}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((webinar) => {
                      const label = formatLocalDateTime(webinar.startTime)
                      const isSelected = selectedWebinarId === webinar.id
                      return (
                        <button
                          key={webinar.id}
                          type="button"
                          className={`rounded-full border px-3 py-1 text-xs md:text-sm transition-all ${
                            isSelected
                              ? 'border-[#CCA43B] bg-[#CCA43B]/10 text-[#1D2A38]'
                              : 'border-[#1D2A38]/20 bg-white/60 text-[#1D2A38] hover:border-[#CCA43B]/70'
                          }`}
                          onClick={() => {
                            setSelectedWebinarId(webinar.id)
                            setSelectedTitle(group.title)
                            setSelectedDateLabel(label)
                          }}
                        >
                          {label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-end pt-2">
            <Button
              type="button"
              disabled={!canContinueFromStep1}
              onClick={() => setStep(2)}
              className="bg-[#1D2A38] hover:bg-[#1D2A38]/90 text-white px-5 py-2 rounded-lg text-sm"
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Minimal registration */}
      {step === 2 && (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-[0.16em] text-[#1D2A38] uppercase">
              Step 2
            </p>
            <h3 className="text-base md:text-lg font-semibold text-[#1D2A38]">
              Quick registration
            </h3>
            {selectedTitle && selectedDateLabel && (
              <p className="text-xs md:text-sm text-[#1D2A38]/80">
                {selectedTitle} · {selectedDateLabel}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                required
                placeholder="Enter your first name"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="situation" className="flex justify-between text-sm text-[#1D2A38]">
                <span>What best describes your situation?</span>
                <span className="text-[11px] font-medium text-[#B8932F] bg-white/80 px-1.5 py-0.5 rounded-full border border-[#CCA43B]/40">
                  Optional
                </span>
              </Label>
              <Textarea
                id="situation"
                value={situation}
                onChange={(event) => setSituation(event.target.value)}
                placeholder="(Optional) Share a sentence or two so we can better tailor the session."
                rows={3}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs text-[#1D2A38]/70 underline-offset-4 hover:underline"
            >
              Back to dates
            </button>
            <Button
              type="submit"
              disabled={!canSubmitStep2 || isSubmitting}
              className="bg-[#1D2A38] hover:bg-[#1D2A38]/90 text-white px-5 py-2 rounded-lg text-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving your spot...
                </>
              ) : (
                'Save my spot'
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

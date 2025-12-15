'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Sparkles, Gift, Calendar, Clock, Video, Home } from 'lucide-react';

export default function WebinarRegistration() {
  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#F6F7F4]"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      
      {/* Header with Login Button */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F6F7F4] backdrop-blur-sm border-b border-[#CCA43B]/20 transition-all duration-300" >
        <div className="container mx-auto px-4 py-3 md:py-4 transition-all duration-300">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl md:text-2xl font-bold text-[#1D2A38] hover:text-[#CCA43B] transition-colors">
              Freedom Framework™
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button size="lg" variant="outline" className="!border-2 !border-[#1D2A38]/40 !text-[#1D2A38] !bg-[#F6F7F4] hover:!bg-[#CCA43B]/20 font-semibold px-4 py-2 transition-all" >
                  <Home className="h-4 w-4 mr-2" /> Home
                </Button>
              </Link>
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
          <section className="relative overflow-hidden rounded-3xl border border-[#CCA43B]/50 bg-[#F6F7F4] backdrop-blur-md px-6 py-10 md:px-10 md:py-14 shadow-lg animate-in fade-in slide-in-from-bottom duration-700">

            <div className="relative text-center space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full bg-[#1D2A38] text-xs md:text-sm font-semibold tracking-[0.18em] text-white px-4 py-1 uppercase">
                <Sparkles className="h-3 w-3 text-[#CCA43B]" />
                Free 2-Hour Masterclass
              </p>
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#1D2A38] leading-tight">
                Beyond the Billable: The Freedom Framework for Scaling Law Firms Without Sacrifice
              </h1>
              
              <p className="text-lg md:text-xl text-[#1D2A38]/90">
                A Free 2-Hour Masterclass for Law Firm Owners Generating $2M+
              </p>
              
              <p className="text-base md:text-lg text-[#1D2A38]/90 max-w-3xl mx-auto">
                Unlock the three operational shifts that allow 7- and 8-figure firms to scale profitably without tying the owner's life to the business.
              </p>
              
              <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 inline-block">
                <p className="text-sm md:text-base text-[#1D2A38]/90 mb-3 flex items-start gap-2">
                  <Gift className="h-5 w-5 text-[#CCA43B] flex-shrink-0 mt-0.5" />
                  Register now to receive your personalized Freedom Matrix Diagnostic™ delivered straight to your inbox.
                </p>
              </div>

              <div className="flex justify-center">
                <Link href="/sign-in">
                  <Button className="bg-gradient-to-r from-[#CCA43B] to-[#B8932F] hover:from-[#B8932F] hover:to-[#CCA43B] text-white font-bold px-8 py-4 text-lg rounded-xl border-2 border-[#CCA43B] transition-all flex items-center gap-2" >
                    Register Now — Free
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
              </div>
          </section>

          {/* Why This Training is Different */}
          <section className="rounded-3xl border border-[#CCA43B]/50 bg-[#F6F7F4] backdrop-blur-md p-6 md:p-8 shadow-lg animate-in fade-in slide-in-from-bottom duration-700">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1D2A38] mb-4">⭐ Why This Training is Different (And Why You Need the Diagnostic)</h2>
            
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
                  <h3 className="text-xl font-semibold text-[#1D2A38] mb-2">Your Freedom Matrix Diagnostic™ (Email Delivery Required)</h3>
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

              <p className="text-[#1D2A38]/90 italic mt-4 ml-9">Your score will arrive by email once you register.</p>
            </div>
          </section>

          {/* What You'll Learn */}
          <section className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1D2A38] text-center">⭐ What You'll Learn During the Free 2-Hour Masterclass</h2>
            <p className="text-[#1D2A38]/90 text-center mb-8">This masterclass will give you clarity on:</p>

            <div className="grid gap-6 md:gap-8 md:grid-cols-2">
              <article className="rounded-3xl border border-[#1D2A38]/40 bg-[#F6F7F4] backdrop-blur-md p-6 md:p-7 shadow-lg hover:shadow-xl transition-all" >
                <h3 className="text-lg md:text-xl font-semibold text-[#1D2A38] mb-3">1. The Freedom Matrix™</h3>
                <p className="text-[#1D2A38]/90 mb-3">
                  How to diagnose exactly what's limiting your firm's ability to scale without consuming you.
                </p>
                <p className="text-[#1D2A38]/90 mb-2">You'll understand the difference between:</p>
                <ul className="space-y-1.5 text-[#1D2A38]/90 text-sm">
                  <li>• Money freedom vs. time freedom</li>
                  <li>• Growth vs. owner dependency</li>
                  <li>• Revenue vs. operational design</li>
                </ul>
              </article>

              <article className="rounded-3xl border border-[#1D2A38]/40 bg-[#F6F7F4] backdrop-blur-md p-6 md:p-7 shadow-lg hover:shadow-xl transition-all" >
                <h3 className="text-lg md:text-xl font-semibold text-[#1D2A38] mb-3">2. The Hidden Traps of Hourly, Flat-Fee, and Contingency Models</h3>
                <p className="text-[#1D2A38]/90 mb-3">Every billing model contains a built-in freedom trap.</p>
                <p className="text-[#1D2A38]/90 mb-2">You'll learn:</p>
                <ul className="space-y-1.5 text-[#1D2A38]/90 text-sm">
                  <li>• Why hourly firms get stuck in utilization overload</li>
                  <li>• Why flat-fee firms lose profit through scope creep</li>
                  <li>• Why contingency firms live in volatility</li>
                  <li>• And more importantly — how to escape these traps</li>
                </ul>
              </article>

              <article className="rounded-3xl border border-[#1D2A38]/40 bg-[#F6F7F4] backdrop-blur-md p-6 md:p-7 shadow-lg hover:shadow-xl transition-all" >
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

              <article className="rounded-3xl border border-[#1D2A38]/40 bg-[#F6F7F4] backdrop-blur-md p-6 md:p-7 shadow-lg hover:shadow-xl transition-all" >
                <h3 className="text-lg md:text-xl font-semibold text-[#1D2A38] mb-3">4. How High-Performing Firms Scale Without Sacrifice</h3>
                <p className="text-[#1D2A38]/90 mb-3">You'll see how these shifts create:</p>
                <ul className="space-y-1.5 text-[#1D2A38]/90 text-sm">
                  <li>• Better profit margins</li>
                  <li>• Stronger leadership</li>
                  <li>• Reduced owner involvement</li>
                  <li>• A business that serves your life, not the other way around</li>
                </ul>
              </article>
            </div>
          </section>

          {/* What You Receive */}
          <section className="rounded-3xl border border-[#CCA43B]/40 bg-[#1D2A38] backdrop-blur-md text-white px-6 py-8 md:px-10 md:py-10 shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">⭐ What You Receive When You Register</h2>
            <p className="text-white/90 mb-6 text-center">You get immediate access to:</p>

            <div className="grid gap-4 md:gap-6 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <Gift className="h-6 w-6 text-[#CCA43B] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold mb-1">1. Your Freedom Matrix Diagnostic™</p>
                  <p className="text-sm text-white/80">Delivered by email upon registration — personalized insights you can't get anywhere else.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Gift className="h-6 w-6 text-[#CCA43B] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold mb-1">2. The Operational Freedom Scorecard</p>
                  <p className="text-sm text-white/80">A simple tool to identify time + money leaks in your firm. (Delivered after the webinar.)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Gift className="h-6 w-6 text-[#CCA43B] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold mb-1">3. Access to the 2-hour masterclass</p>
                  <p className="text-sm text-white/80">Plus the replay for internal leadership training.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Gift className="h-6 w-6 text-[#CCA43B] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold mb-1">4. A private invitation to our next advanced workshop</p>
                  <p className="text-sm text-white/80">Optional, for owners who want deeper implementation support.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Who This Is For */}
          <section className="grid gap-8 md:grid-cols-2 items-start">
            <div className="rounded-3xl border border-[#1D2A38]/40 bg-[#F6F7F4] backdrop-blur-md p-6 md:p-8 shadow-md">
              <h2 className="text-2xl md:text-3xl font-bold text-[#1D2A38] mb-4">⭐ Who This Masterclass Is For</h2>
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

            <div className="rounded-3xl border border-[#CCA43B]/40 bg-[#F6F7F4] backdrop-blur-md p-6 md:p-8 shadow-md">
              <h2 className="text-2xl md:text-3xl font-bold text-[#1D2A38] mb-4">⭐ About Your Instructor</h2>
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
          </section>

          {/* Event Details */}
          <section className="rounded-3xl border border-[#CCA43B]/50 bg-[#F6F7F4] backdrop-blur-md p-6 md:p-8 text-center shadow-md">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1D2A38] mb-6">⭐ Event Details</h2>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
              <div className="flex flex-col items-center gap-2">
                <Calendar className="h-8 w-8 text-[#CCA43B]" />
                <p className="text-sm text-[#1D2A38]/85">Date</p>
                <p className="text-[#1D2A38]/90 font-semibold">[Insert date]</p>
              </div>

              <div className="flex flex-col items-center gap-2">
                <Clock className="h-8 w-8 text-[#CCA43B]" />
                <p className="text-sm text-[#1D2A38]/85">Time</p>
                <p className="text-[#1D2A38]/90 font-semibold">[Insert time]</p>
              </div>

              <div className="flex flex-col items-center gap-2">
                <Clock className="h-8 w-8 text-[#CCA43B]" />
                <p className="text-sm text-[#1D2A38]/85">Length</p>
                <p className="text-[#1D2A38]/90 font-semibold">2 hours</p>
              </div>

              <div className="flex flex-col items-center gap-2">
                <Video className="h-8 w-8 text-[#CCA43B]" />
                <p className="text-sm text-[#1D2A38]/85">Format</p>
                <p className="text-[#1D2A38]/90 font-semibold">Live on Zoom</p>
              </div>
            </div>

            <div className="mt-6 space-y-2 text-[#1D2A38]/90">
              <p><span className="font-semibold">Replay:</span> Yes — emailed to all registrants</p>
              <p><span className="font-semibold">Diagnostic:</span> Delivered automatically by email upon registration</p>
            </div>
          </section>

          {/* FAQ */}
          <section className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1D2A38] text-center">⭐ FAQ</h2>
            
            <div className="grid gap-4">
              <div className="rounded-2xl border border-[#1D2A38]/40 bg-[#F6F7F4] p-5 shadow-sm hover:shadow-md transition-all">
                <h3 className="text-lg font-semibold text-[#1D2A38] mb-2">Will this training be recorded?</h3>
                <p className="text-[#1D2A38]/90">Yes — registrants will receive the replay link.</p>
              </div>

              <div className="rounded-2xl border border-[#1D2A38]/40 bg-[#F6F7F4] p-5 shadow-sm hover:shadow-md transition-all">
                <h3 className="text-lg font-semibold text-[#1D2A38] mb-2">Is this for small or new firms?</h3>
                <p className="text-[#1D2A38]/90">No — the content in this webinar would be challenging for a firm that does not have admin support in operations to implement. This is recommended for firms that have generated at least $2M+ in annual revenue.</p>
              </div>

              <div className="rounded-2xl border border-[#1D2A38]/40 bg-[#F6F7F4] p-5 shadow-sm hover:shadow-md transition-all">
                <h3 className="text-lg font-semibold text-[#1D2A38] mb-2">Will I get my diagnostic without providing email?</h3>
                <p className="text-[#1D2A38]/90">No — your quadrant summary is delivered by email only.</p>
              </div>

              <div className="rounded-2xl border border-[#1D2A38]/40 bg-[#F6F7F4] p-5 shadow-sm hover:shadow-md transition-all">
                <h3 className="text-lg font-semibold text-[#1D2A38] mb-2">Is this a sales webinar?</h3>
                <p className="text-[#1D2A38]/90">The training is 100% valuable on its own. At the end, you'll hear about the Freedom Framework™ 12-month program, but there is zero pressure to join.</p>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="rounded-3xl border border-[#CCA43B]/50 bg-[#F6F7F4] backdrop-blur-md px-6 py-10 md:px-10 md:py-12 text-center shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1D2A38] mb-4">⭐ Ready to Discover Your Path to Freedom?</h2>
            <p className="text-[#1D2A38]/90 mb-6 max-w-2xl mx-auto text-base md:text-lg">
              If you want a law firm that scales profitably and gives you back your life… start by learning where your firm stands today.
            </p>
            <p className="text-[#1D2A38]/90 mb-8 max-w-2xl mx-auto">
              Register now to claim your seat and receive your Freedom Matrix Diagnostic by email.
            </p>
            <Link href="/sign-in">
              <Button className="bg-gradient-to-r from-[#CCA43B] to-[#B8932F] hover:from-[#B8932F] hover:to-[#CCA43B] text-white font-bold px-10 py-4 text-lg rounded-xl border-2 border-[#CCA43B] transition-all inline-flex items-center gap-2" >
                Register Now — Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </section>
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

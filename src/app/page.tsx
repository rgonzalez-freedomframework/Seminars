import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import ExecutiveBackground from '@/components/ExecutiveBackground';
export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <ExecutiveBackground className="absolute inset-0 -z-20" />
      {/* Slight tint so content stays readable without hiding the network background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-slate-950/35 via-slate-900/15 to-slate-950/45" />
      {/* Header with Login Button */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-white via-white/95 to-white/90 backdrop-blur-md border-b-2 border-[#CCA43B]/20 shadow-lg transition-all duration-300">
        <div className="container mx-auto px-4 py-3 md:py-4 transition-all duration-300">
          <div className="flex justify-between items-center">
            <Link href="/?view=landing" className="text-xl md:text-2xl font-bold text-[#1D2A38] hover:text-[#CCA43B] transition-colors">
              Freedom Framework™
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline" className="!border-2 !border-gray-400 !text-[#1D2A38] !bg-white hover:!bg-[#1D2A38] hover:!text-white font-semibold px-4 py-2 md:px-6 md:py-3 transition-all shadow-sm">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </header>
      {/* Sales Page Main Content */}
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-6xl space-y-16">
          {/* Hero / Title */}
          <section className="relative overflow-hidden rounded-3xl border border-[#CCA43B]/20 bg-white/90 shadow-xl px-6 py-10 md:px-10 md:py-14 animate-in fade-in slide-in-from-bottom duration-700">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-24 -right-10 h-64 w-64 rounded-full bg-[#CCA43B]/30 blur-3xl" />
              <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-[#1D2A38]/20 blur-3xl" />
            </div>

            <div className="relative grid gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] items-center">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-[#1D2A38] text-xs md:text-sm font-semibold tracking-[0.18em] text-white px-4 py-1 uppercase mb-4">
                  <Sparkles className="h-3 w-3 text-[#CCA43B]" />
                  The Freedom Framework™ Program
                </p>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#1D2A38] leading-tight mb-4">
                  For Law Firm Owners Ready to Scale Growth — Without Sacrificing Time, Autonomy, or Sanity
                </h1>
                <p className="text-lg md:text-xl text-gray-700 mb-3">
                  You’ve built a successful law firm. Now it’s time to build your freedom.
                </p>
                <p className="text-base md:text-lg text-gray-700 mb-6">
                  The Freedom Framework is the only program designed specifically for 7- and 8-figure law firm owners who want a business that runs with clarity, profitability, and autonomy — without the daily drain of being the bottleneck.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <Link href="/sign-in">
                    <Button className="bg-gradient-to-r from-[#FDE68A] via-[#FBBF24] to-[#F59E0B] hover:from-[#FBBF24] hover:to-[#FDE68A] text-[#1D2A38] font-bold px-7 py-3 rounded-xl border-2 border-[#FBBF24]/80 shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                      Apply to Join the Freedom Framework™
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <p className="text-xs md:text-sm text-gray-600">
                    Designed for established firms ready to scale with intention.
                  </p>
                </div>
              </div>

              <div className="relative rounded-2xl border border-gray-200 bg-gray-50/80 p-6 md:p-7 shadow-sm backdrop-blur-sm animate-in fade-in slide-in-from-right duration-700 delay-150">
                <h2 className="text-sm font-semibold text-[#1D2A38] mb-3 uppercase tracking-[0.18em]">Program Snapshot</h2>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-[#CCA43B]" />
                    <span>Built for 7- and 8-figure law firm owners</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-[#CCA43B]" />
                    <span>Focus on accountability, predictability, and autonomy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-[#CCA43B]" />
                    <span>Live workshops, implementation toolkits, and advisory support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-[#CCA43B]" />
                    <span>Designed to reduce owner dependency and unlock freedom</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Who This Is For */}
          <section id="who-this-is-for" className="grid gap-8 md:grid-cols-[minmax(0,1.8fr)_minmax(0,1.2fr)] items-start">
            <div className="rounded-3xl border border-gray-200 bg-white/90 p-6 md:p-8 shadow-md animate-in fade-in slide-in-from-left duration-700">
              <h2 className="text-2xl md:text-3xl font-bold text-[#1D2A38] mb-4">⭐ Who This Is For</h2>
              <p className="text-gray-700 mb-4">
                This program is made for law firm owners who:
              </p>
              <ul className="space-y-3 text-gray-700">
                {[
                  'Have surpassed $2M in revenue and are feeling the weight of growth',
                  'Are still involved in too much day-to-day decision-making',
                  'Have leaders who “help,” but don’t take full ownership',
                  'Want consistent profitability, predictable operations, and reduced chaos',
                  'Know their firm needs structure — but don’t have time to create it',
                  'Are ready for true time and money freedom',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-1 text-[#CCA43B]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-gray-700 mt-5">
                If your firm is in the Grind Zone, Drift Zone, or Golden Cage, this is your path out.
              </p>
            </div>

            <div className="space-y-4 animate-in fade-in slide-in-from-right duration-700 delay-150">
              <h3 className="text-sm font-semibold tracking-[0.16em] text-[#1D2A38] uppercase">Where You Might Be Now</h3>
              <div className="grid gap-4">
                <div className="rounded-2xl border border-red-100 bg-red-50/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-700 mb-1">Grind Zone</p>
                  <p className="text-sm text-red-900">
                    High effort, low return. You&apos;re working hard, but the business still leans on you for everything.
                  </p>
                </div>
                <div className="rounded-2xl border border-blue-100 bg-blue-50/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700 mb-1">Drift Zone</p>
                  <p className="text-sm text-blue-900">
                    Low activity, low results. The firm has potential, but there&apos;s no clear operating system driving growth.
                  </p>
                </div>
                <div className="rounded-2xl border border-amber-100 bg-amber-50/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700 mb-1">Golden Cage</p>
                  <p className="text-sm text-amber-900">
                    Profitable, but owner-dependent. The firm is successful on paper, but you can&apos;t step away without stress.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Core Promise */}
          <section id="core-promise" className="rounded-3xl border border-[#CCA43B]/30 bg-[#1D2A38] text-white px-6 py-8 md:px-10 md:py-10 shadow-lg animate-in fade-in slide-in-from-bottom duration-700">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">⭐ The Core Promise</h2>
            <p className="text-base md:text-lg mb-4 text-gray-100">
              We help law firm owners redesign their firm so it delivers both time freedom and financial freedom — through simple, repeatable operational systems that scale.
            </p>
            <div className="space-y-1 text-sm md:text-base">
              <p>This is not a course.</p>
              <p>This is not theory.</p>
              <p className="font-semibold text-[#FDE68A]">
                This is the Framework your law firm has been missing.
              </p>
            </div>
          </section>

          {/* What You Get */}
          <section id="inside-program" className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[#1D2A38]">⭐ Here’s What You Get Inside the Program</h2>
              <p className="text-sm md:text-base text-gray-600 max-w-md">
                Every element is built to move your firm from owner-dependent to owner-optional — without adding unnecessary complexity.
              </p>
            </div>

            <div className="grid gap-6 md:gap-8 md:grid-cols-2">
              <article className="rounded-3xl border border-gray-200 bg-white p-6 md:p-7 shadow-sm hover:shadow-md transition-all animate-in fade-in slide-in-from-left duration-700">
                <h3 className="text-lg md:text-xl font-semibold text-[#1D2A38] mb-2">1. Monthly Deep-Dive Workshops (Live + Recorded)</h3>
                <p className="text-gray-700 mb-3">
                  Each month focuses on one of the three operational shifts:
                </p>
                <ul className="space-y-1.5 text-gray-700 text-sm">
                  <li>Accountability Shift — Build a team that performs without pushing</li>
                  <li>Predictability Shift — Engineer profit and cash flow with clarity</li>
                  <li>Autonomy Shift — Turn your firm into a self-managing business</li>
                </ul>
                <p className="text-gray-700 text-sm mt-3">
                  You’ll walk away from each workshop with templates, scorecards, and decisions you can implement immediately.
                </p>
              </article>

              <article className="rounded-3xl border border-gray-200 bg-white p-6 md:p-7 shadow-sm hover:shadow-md transition-all animate-in fade-in slide-in-from-right duration-700">
                <h3 className="text-lg md:text-xl font-semibold text-[#1D2A38] mb-2">2. The Freedom Matrix Implementation Toolkit</h3>
                <p className="text-gray-700 mb-3">A complete suite of operational tools, including:</p>
                <ul className="space-y-1.5 text-gray-700 text-sm">
                  <li>Role scorecard templates</li>
                  <li>KPI dashboards and scorecards</li>
                  <li>Cash flow forecasting tools</li>
                  <li>Systems documentation templates</li>
                  <li>Delegation and decision rights map</li>
                  <li>Meeting rhythm + leadership cadence frameworks</li>
                </ul>
                <p className="text-gray-700 text-sm mt-3">Everything is plug-and-play.</p>
              </article>

              <article className="rounded-3xl border border-gray-200 bg-white p-6 md:p-7 shadow-sm hover:shadow-md transition-all animate-in fade-in slide-in-from-left duration-700 delay-100">
                <h3 className="text-lg md:text-xl font-semibold text-[#1D2A38] mb-2">3. Private Freedom Owners Community</h3>
                <p className="text-gray-700 mb-2">
                  A curated group of law firm owners committed to scaling with intention, not burnout.
                </p>
                <p className="text-gray-700 mb-2 text-sm">This is your space to:</p>
                <ul className="space-y-1.5 text-gray-700 text-sm">
                  <li>Share wins and challenges</li>
                  <li>Compare systems, numbers, and metrics</li>
                  <li>Get feedback on leadership issues</li>
                  <li>Learn what’s actually working in real firms</li>
                </ul>
                <p className="text-gray-700 text-sm mt-3">This community alone accelerates growth.</p>
              </article>

              <article className="rounded-3xl border border-gray-200 bg-white p-6 md:p-7 shadow-sm hover:shadow-md transition-all animate-in fade-in slide-in-from-right duration-700 delay-100">
                <h3 className="text-lg md:text-xl font-semibold text-[#1D2A38] mb-2">4. Quarterly Implementation Labs</h3>
                <p className="text-gray-700 mb-2">Hands-on working sessions where we:</p>
                <ul className="space-y-1.5 text-gray-700 text-sm">
                  <li>Build or refine your firm’s leadership structure</li>
                  <li>Optimize your financial visibility</li>
                  <li>Identify and fix your biggest operational bottlenecks</li>
                  <li>Create a path to owner autonomy over the next 12 months</li>
                </ul>
                <p className="text-gray-700 text-sm mt-3">This is where the real transformation happens.</p>
              </article>

              <article className="rounded-3xl border border-gray-200 bg-white p-6 md:p-7 shadow-sm hover:shadow-md transition-all md:col-span-2 animate-in fade-in slide-in-from-bottom duration-700 delay-150">
                <h3 className="text-lg md:text-xl font-semibold text-[#1D2A38] mb-2">5. Office Hours</h3>
                <p className="text-gray-700 mb-2">Monthly office hours where you can bring:</p>
                <ul className="grid md:grid-cols-2 gap-x-6 gap-y-1.5 text-gray-700 text-sm">
                  <li>Team issues</li>
                  <li>Profit questions</li>
                  <li>Billing model complexities</li>
                  <li>Hiring decisions</li>
                  <li>Operational fires</li>
                  <li>Leadership challenges</li>
                </ul>
                <p className="text-gray-700 text-sm mt-3">
                  You get real-time answers from someone who’s scaled firms, not just studied them.
                </p>
              </article>
            </div>
          </section>

          {/* Result */}
          <section id="result" className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)] items-start">
            <div className="rounded-3xl border border-gray-200 bg-white/90 p-6 md:p-8 shadow-md animate-in fade-in slide-in-from-left duration-700">
              <h2 className="text-2xl md:text-3xl font-bold text-[#1D2A38] mb-4">⭐ The Result?</h2>
              <p className="text-gray-700 mb-3">
                A business that funds the life you want — without consuming it.
              </p>
              <p className="text-gray-700 mb-4">You’ll walk away with:</p>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-1 text-[#CCA43B]" />
                  <span>A leadership team that takes ownership</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-1 text-[#CCA43B]" />
                  <span>Systems that make your firm predictable and profitable</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-1 text-[#CCA43B]" />
                  <span>Clarity around your numbers and future planning</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-1 text-[#CCA43B]" />
                  <span>Reduced owner dependency</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-1 text-[#CCA43B]" />
                  <span>More time, more peace, more control</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-1 text-[#CCA43B]" />
                  <span>A business that finally feels like a business — not a burden</span>
                </li>
              </ul>
            </div>

            {/* Roadmap */}
            <div id="roadmap" className="rounded-3xl border border-dashed border-[#CCA43B]/60 bg-[#FFF9E6] p-6 md:p-8 shadow-sm animate-in fade-in slide-in-from-right duration-700">
              <h2 className="text-2xl md:text-3xl font-bold text-[#1D2A38] mb-4">⭐ Your Freedom Framework Roadmap</h2>
              <ol className="space-y-3 text-gray-800 text-sm md:text-base">
                {[
                  'Phase 1: Diagnose your firm’s quadrant',
                  'Phase 2: Stabilize the operational foundations',
                  'Phase 3: Systematize accountability, profit, and autonomy',
                  'Phase 4: Scale intentionally',
                  'Phase 5: Optimize for continuous freedom',
                ].map((phase, index) => (
                  <li key={phase} className="flex gap-3 items-start">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1D2A38] text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    <span>{phase}</span>
                  </li>
                ))}
              </ol>
              <p className="text-gray-800 mt-4 text-sm md:text-base">
                This is the roadmap used by 7- and 8-figure firms that run without owner burnout.
              </p>
            </div>
          </section>

          {/* Program Options */}
          <section id="program-options" className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[#1D2A38]">⭐ Program Options</h2>
              <p className="text-sm md:text-base text-gray-600 max-w-md">
                (Pricing intentionally omitted so you can adjust or add a call-to-apply.)
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <article className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-sm hover:shadow-md transition-all animate-in fade-in slide-in-from-left duration-700">
                <h3 className="text-lg font-semibold text-[#1D2A38] mb-2">Freedom Framework Membership</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Includes: Monthly deep-dives, toolkit access, community, office hours.
                </p>
                <p className="text-xs font-medium text-[#1D2A38] bg-[#FDE68A]/70 inline-flex px-3 py-1 rounded-full">
                  Best for firms under $5M
                </p>
              </article>

              <article className="rounded-3xl border-2 border-[#CCA43B] bg-white p-6 shadow-md hover:shadow-lg transition-all animate-in fade-in slide-in-from-bottom duration-700">
                <h3 className="text-lg font-semibold text-[#1D2A38] mb-2">Freedom Framework Accelerator</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Includes: Everything above + quarterly implementation labs + direct advisory.
                </p>
                <p className="text-xs font-medium text-white bg-[#1D2A38] inline-flex px-3 py-1 rounded-full">
                  Best for firms $5M–$20M+
                </p>
              </article>

              <article className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-sm hover:shadow-md transition-all animate-in fade-in slide-in-from-right duration-700">
                <h3 className="text-lg font-semibold text-[#1D2A38] mb-2">Private Advisory Partnership</h3>
                <p className="text-sm text-gray-700 mb-3">
                  High-touch, firm-specific operational transformation with deep advisory support.
                </p>
                <p className="text-xs font-medium text-[#1D2A38] bg-gray-100 inline-flex px-3 py-1 rounded-full">
                  Application only
                </p>
              </article>
            </div>
          </section>

          {/* Final CTA */}
          <section id="cta" className="rounded-3xl border border-[#CCA43B]/40 bg-gradient-to-r from-[#CCA43B]/10 via-white to-[#1D2A38]/5 px-6 py-10 md:px-10 md:py-12 text-center shadow-md animate-in fade-in slide-in-from-bottom duration-700">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1D2A38] mb-4">⭐ Next Step: Join the Freedom Framework™</h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto text-sm md:text-base">
              Click below to secure your spot in the next session. Build the firm that gives you back your time, your profit, and your peace.
            </p>
            <Link href="/sign-in">
              <Button className="bg-gradient-to-r from-[#CCA43B] to-[#B8932F] hover:from-[#B8932F] hover:to-[#CCA43B] text-[#1D2A38] font-bold px-10 py-3 rounded-xl border-2 border-[#CCA43B] shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2">
                Apply to Join the Freedom Framework™
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 md:py-12 border-t border-gray-300 bg-white/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-700 mb-2">
            Freedom Framework™ for Law Firm Owners
          </p>
          <p className="text-gray-600 text-sm">
            © 2025 All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
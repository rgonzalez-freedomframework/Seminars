import Link from 'next/link';
import { Button } from '@/components/ui/button';
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
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
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Hero / Title */}
          <section className="mb-12 md:mb-16 text-left">
            <p className="text-xs md:text-sm font-semibold tracking-[0.18em] text-[#CCA43B] uppercase mb-3">
              The Freedom Framework™ Program
            </p>
            <h1 className="text-3xl md:text-5xl font-bold text-[#1D2A38] leading-tight mb-4">
              For Law Firm Owners Ready to Scale Growth — Without Sacrificing Time, Autonomy, or Sanity
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-3">
              You’ve built a successful law firm. Now it’s time to build your freedom.
            </p>
            <p className="text-lg text-gray-700">
              The Freedom Framework is the only program designed specifically for 7- and 8-figure law firm owners who want a business that runs with clarity, profitability, and autonomy — without the daily drain of being the bottleneck.
            </p>
          </section>

          {/* Who This Is For */}
          <section className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1D2A38] mb-4">⭐ Who This Is For</h2>
            <p className="text-gray-700 mb-4">
              This program is made for law firm owners who:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Have surpassed $2M in revenue and are feeling the weight of growth</li>
              <li>Are still involved in too much day-to-day decision-making</li>
              <li>Have leaders who “help,” but don’t take full ownership</li>
              <li>Want consistent profitability, predictable operations, and reduced chaos</li>
              <li>Know their firm needs structure — but don’t have time to create it</li>
              <li>Are ready for true time and money freedom</li>
            </ul>
            <p className="text-gray-700 mt-4">
              If your firm is in the Grind Zone, Drift Zone, or Golden Cage, this is your path out.
            </p>
          </section>

          {/* Core Promise */}
          <section className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1D2A38] mb-4">⭐ The Core Promise</h2>
            <p className="text-gray-700 mb-3">
              We help law firm owners redesign their firm so it delivers both time freedom and financial freedom — through simple, repeatable operational systems that scale.
            </p>
            <p className="text-gray-700">This is not a course.</p>
            <p className="text-gray-700">This is not theory.</p>
            <p className="text-gray-700 font-semibold">
              This is the Framework your law firm has been missing.
            </p>
          </section>

          {/* What You Get */}
          <section className="mb-10 md:mb-12 space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1D2A38] mb-2">⭐ Here’s What You Get Inside the Program</h2>

            <div>
              <h3 className="text-xl font-semibold text-[#1D2A38] mb-1">1. Monthly Deep-Dive Workshops (Live + Recorded)</h3>
              <p className="text-gray-700 mb-2">
                Each month focuses on one of the three operational shifts:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Accountability Shift — Build a team that performs without pushing</li>
                <li>Predictability Shift — Engineer profit and cash flow with clarity</li>
                <li>Autonomy Shift — Turn your firm into a self-managing business</li>
              </ul>
              <p className="text-gray-700 mt-2">
                You’ll walk away from each workshop with templates, scorecards, and decisions you can implement immediately.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#1D2A38] mb-1">2. The Freedom Matrix Implementation Toolkit</h3>
              <p className="text-gray-700 mb-2">A complete suite of operational tools, including:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Role scorecard templates</li>
                <li>KPI dashboards and scorecards</li>
                <li>Cash flow forecasting tools</li>
                <li>Systems documentation templates</li>
                <li>Delegation and decision rights map</li>
                <li>Meeting rhythm + leadership cadence frameworks</li>
              </ul>
              <p className="text-gray-700 mt-2">Everything is plug-and-play.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#1D2A38] mb-1">3. Private Freedom Owners Community</h3>
              <p className="text-gray-700 mb-2">
                A curated group of law firm owners committed to scaling with intention, not burnout.
              </p>
              <p className="text-gray-700 mb-2">This is your space to:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Share wins and challenges</li>
                <li>Compare systems, numbers, and metrics</li>
                <li>Get feedback on leadership issues</li>
                <li>Learn what’s actually working in real firms</li>
              </ul>
              <p className="text-gray-700 mt-2">This community alone accelerates growth.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#1D2A38] mb-1">4. Quarterly Implementation Labs</h3>
              <p className="text-gray-700 mb-2">Hands-on working sessions where we:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Build or refine your firm’s leadership structure</li>
                <li>Optimize your financial visibility</li>
                <li>Identify and fix your biggest operational bottlenecks</li>
                <li>Create a path to owner autonomy over the next 12 months</li>
              </ul>
              <p className="text-gray-700 mt-2">This is where the real transformation happens.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#1D2A38] mb-1">5. Office Hours</h3>
              <p className="text-gray-700 mb-2">Monthly office hours where you can bring:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Team issues</li>
                <li>Profit questions</li>
                <li>Billing model complexities</li>
                <li>Hiring decisions</li>
                <li>Operational fires</li>
                <li>Leadership challenges</li>
              </ul>
              <p className="text-gray-700 mt-2">
                You get real-time answers from someone who’s scaled firms, not just studied them.
              </p>
            </div>
          </section>

          {/* Result */}
          <section className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1D2A38] mb-4">⭐ The Result?</h2>
            <p className="text-gray-700 mb-3">
              A business that funds the life you want — without consuming it.
            </p>
            <p className="text-gray-700 mb-3">You’ll walk away with:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>A leadership team that takes ownership</li>
              <li>Systems that make your firm predictable and profitable</li>
              <li>Clarity around your numbers and future planning</li>
              <li>Reduced owner dependency</li>
              <li>More time, more peace, more control</li>
              <li>A business that finally feels like a business — not a burden</li>
            </ul>
          </section>

          {/* Roadmap */}
          <section className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1D2A38] mb-4">⭐ Your Freedom Framework Roadmap</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Phase 1: Diagnose your firm’s quadrant</li>
              <li>Phase 2: Stabilize the operational foundations</li>
              <li>Phase 3: Systematize accountability, profit, and autonomy</li>
              <li>Phase 4: Scale intentionally</li>
              <li>Phase 5: Optimize for continuous freedom</li>
            </ul>
            <p className="text-gray-700 mt-3">
              This is the roadmap used by 7- and 8-figure firms that run without owner burnout.
            </p>
          </section>

          {/* Program Options */}
          <section className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1D2A38] mb-4">⭐ Program Options</h2>
            <p className="text-gray-700 mb-3">
              (Pricing intentionally omitted so you can adjust or add a call-to-apply.)
            </p>
            <ul className="space-y-3 text-gray-700">
              <li>
                <span className="font-semibold">Freedom Framework Membership</span>
                <br />
                Includes: Monthly deep-dives, toolkit access, community, office hours
                <br />
                <span className="italic">Best for firms under $5M</span>
              </li>
              <li>
                <span className="font-semibold">Freedom Framework Accelerator</span>
                <br />
                Includes: Everything above + quarterly implementation labs + direct advisory
                <br />
                <span className="italic">Best for firms $5M–$20M+</span>
              </li>
              <li>
                <span className="font-semibold">Private Advisory Partnership</span>
                <br />
                High-touch, firm-specific operational transformation
                <br />
                <span className="italic">Application only</span>
              </li>
            </ul>
          </section>

          {/* Final CTA */}
          <section className="mb-8 md:mb-12 text-center border-t border-gray-200 pt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1D2A38] mb-4">⭐ Next Step: Join the Freedom Framework™</h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Click below to secure your spot in the next session. Build the firm that gives you back your time, your profit, and your peace.
            </p>
            <Link href="/sign-in">
              <Button className="bg-gradient-to-r from-[#CCA43B] to-[#B8932F] hover:from-[#B8932F] hover:to-[#CCA43B] text-[#1D2A38] font-bold px-10 py-3 rounded-xl border-2 border-[#CCA43B] shadow-lg hover:shadow-xl transition-all">
                Apply to Join the Freedom Framework™
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
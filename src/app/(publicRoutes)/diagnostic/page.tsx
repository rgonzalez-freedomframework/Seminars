import { DiagnosticForm } from '@/components/DiagnosticForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DiagnosticPage() {
  return (
    <div className="min-h-screen bg-[#F6F7F4]">
      <div className="relative z-10">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#F6F7F4] backdrop-blur-md border-b border-[#CCA43B]/25 shadow-sm transition-all duration-300">
          <div className="mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2 text-[#1D2A38] hover:text-[#CCA43B] transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span className="font-semibold">Back to Home</span>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline" className="!border-2 !border-[#1D2A38]/40 !text-[#1D2A38] !bg-[#F6F7F4] hover:!bg-[#CCA43B]/20 font-semibold px-4 py-2 transition-all">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-28 pb-20">
          <div className="mx-auto px-4 md:px-6 max-w-6xl">
            {/* Hero */}
            <section className="text-center space-y-6 mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1D2A38] leading-tight">
                Freedom Matrix Diagnostic
              </h1>
              <p className="text-xl md:text-2xl text-[#1D2A38]/90 max-w-3xl mx-auto">
                Discover where your firm stands on the path to freedom
              </p>
              <p className="text-lg text-[#1D2A38]/85 max-w-2xl mx-auto">
                This 5-minute assessment reveals your firm's current position across Time Freedom, Financial Freedom, and Leadership Systems.
              </p>
            </section>

            {/* Diagnostic Form */}
            <DiagnosticForm />
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 border-t border-[#1D2A38]/20 bg-white/50 backdrop-blur-sm relative z-10 shadow-sm">
          <div className="mx-auto px-4 text-center">
            <p className="text-[#1D2A38]/90 mb-2">
              Freedom Framework™ for Law Firm Owners
            </p>
            <p className="text-sm text-[#1D2A38]/85">
              © {new Date().getFullYear()} Freedom Framework. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

import { prismaClient } from '@/lib/prismaClient';
import { WebinarStatusEnum } from '@prisma/client';
import Link from 'next/link';
import { Calendar, Clock, CheckCircle2, Award, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import GeneralRegistrationForm from '@/components/ReusableComponent/GeneralRegistrationForm';

export default async function Home() {
  // Get upcoming and live webinars
  const webinars = await prismaClient.webinar.findMany({
    where: {
      webinarStatus: {
        in: [WebinarStatusEnum.SCHEDULED, WebinarStatusEnum.WAITING_ROOM, WebinarStatusEnum.LIVE],
      },
    },
    include: {
      presenter: {
        select: {
          name: true,
          profileImage: true,
        },
      },
      _count: {
        select: {
          attendances: true,
        },
      },
    },
    orderBy: {
      startTime: 'asc',
    },
    take: 3,
  });

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

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#CCA43B]/5 via-transparent to-[#1D2A38]/5"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-24 sm:py-32 md:py-40 relative z-10 animate-in fade-in duration-1000">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-4 md:mb-6 animate-in slide-in-from-top duration-700">
              <span className="inline-block text-xs md:text-sm font-bold tracking-[0.2em] text-[#CCA43B] uppercase relative">
                <span className="relative z-10">Freedom Framework™</span>
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#CCA43B] to-transparent"></span>
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-[#1D2A38] mb-4 md:mb-6 tracking-tight animate-in slide-in-from-bottom duration-1000">
              Discover Your Firm's
              <span className="block text-[#CCA43B] bg-gradient-to-r from-[#CCA43B] to-[#B8932F] bg-clip-text">Freedom Score</span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-700 mb-6 md:mb-8 leading-relaxed px-4 animate-in fade-in duration-1000 delay-300">
              Take the 5-minute assessment used by 7- and 8-figure law firm owners to diagnose operational bottlenecks and map their path to true time + financial freedom.
            </p>
            <div className="flex justify-center animate-in zoom-in duration-700 delay-500">
              <GeneralRegistrationForm 
                triggerText="Get Started - Register Free"
                triggerClassName="bg-gradient-to-r from-[#CCA43B] to-[#B8932F] hover:from-[#B8932F] hover:to-[#CCA43B] text-[#1D2A38] font-bold text-lg md:text-xl px-8 md:px-12 py-3 md:py-4 rounded-xl text-center inline-flex items-center justify-center shadow-xl hover:shadow-2xl hover:shadow-[#CCA43B]/40 transition-all duration-300 transform hover:scale-105 border-2 border-[#CCA43B]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why This Matters Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#CCA43B]/5 to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-[#1D2A38] mb-8 text-center animate-in slide-in-from-bottom duration-700">
              Why This Matters
            </h2>
            <div className="prose prose-lg mx-auto">
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                You didn't build your law firm to work 60 hours a week.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                And yet—most high-performing firms end up either:
              </p>
              <ul className="space-y-3 text-lg text-gray-700 mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-[#CCA43B] mt-1">•</span>
                  <span>Busy but underpaid</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#CCA43B] mt-1">•</span>
                  <span>Profitable but owner-dependent</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#CCA43B] mt-1">•</span>
                  <span>Stable but stagnant</span>
                </li>
              </ul>
              <p className="text-xl text-[#CCA43B] font-semibold mb-4">
                The real goal?
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                A firm that funds your life and gives you back your time. Find out exactly where your firm stands today.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-l from-[#1D2A38]/5 to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-[#1D2A38] mb-12 text-center">
              What You'll Learn
            </h2>
            <p className="text-xl text-gray-700 mb-8 text-center">
              This diagnostic reveals:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white border-gray-200 shadow-md hover:shadow-xl hover:border-[#CCA43B] transition-all duration-300 transform hover:-translate-y-2 animate-in fade-in duration-700">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-[#CCA43B] flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-[#1D2A38] mb-2">Your Freedom Matrix Position</h3>
                      <p className="text-gray-600">Discover your firm's current quadrant on the Freedom Matrix</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-gray-200 shadow-md hover:shadow-xl hover:border-[#CCA43B] transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-[#CCA43B] flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-[#1D2A38] mb-2">Hidden Freedom Traps</h3>
                      <p className="text-gray-600">Whether your billing model is creating hidden "freedom traps"</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-gray-200 shadow-md hover:shadow-xl hover:border-[#CCA43B] transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-[#CCA43B] flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-[#1D2A38] mb-2">Fastest Path Forward</h3>
                      <p className="text-gray-600">The one operational shift that will unlock the fastest results</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-gray-200 shadow-md hover:shadow-xl hover:border-[#CCA43B] transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-[#CCA43B] flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-[#1D2A38] mb-2">Distance to Freedom</h3>
                      <p className="text-gray-600">How close you really are to the Freedom Zone</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Four Quadrants Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#CCA43B]/10 via-transparent to-[#1D2A38]/5 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-[#1D2A38] mb-12 text-center animate-in slide-in-from-bottom duration-700">
              The Four Quadrants
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-300">
                <CardContent className="p-8">
                  <Award className="w-12 h-12 text-red-600 mb-4" />
                  <h3 className="text-2xl font-bold text-red-900 mb-3">Grind Zone</h3>
                  <p className="text-gray-700">High effort, low return. Working hard but not seeing the financial freedom you deserve.</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300">
                <CardContent className="p-8">
                  <Target className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-2xl font-bold text-blue-900 mb-3">Drift Zone</h3>
                  <p className="text-gray-700">Low activity, low results. Lacking direction and momentum in your practice.</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300">
                <CardContent className="p-8">
                  <TrendingUp className="w-12 h-12 text-amber-600 mb-4" />
                  <h3 className="text-2xl font-bold text-amber-900 mb-3">Golden Cage</h3>
                  <p className="text-gray-700">Profitable but trapped. Making money but owner-dependent and can't step away.</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-[#CCA43B] to-[#CCA43B]/80 border-[#CCA43B]">
                <CardContent className="p-8">
                  <Award className="w-12 h-12 text-[#1D2A38] mb-4" />
                  <h3 className="text-2xl font-bold text-[#1D2A38] mb-3">Freedom Zone</h3>
                  <p className="text-[#1D2A38]">The goal: A firm that funds your life and gives you back your time.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main CTA Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-gray-50 via-white to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#CCA43B]/10 to-[#1D2A38]/5 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1D2A38] mb-6">
              Get Your Freedom Matrix Score
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Click below to access the diagnostic instantly.
            </p>
            <GeneralRegistrationForm 
              triggerText="START THE ASSESSMENT"
              triggerClassName="bg-gradient-to-r from-[#CCA43B] to-[#B8932F] hover:from-[#B8932F] hover:to-[#CCA43B] text-[#1D2A38] font-bold text-lg md:text-xl px-8 md:px-12 py-3 md:py-4 rounded-xl text-center inline-flex items-center justify-center shadow-xl hover:shadow-2xl hover:shadow-[#CCA43B]/40 transition-all duration-300 transform hover:scale-105 animate-in zoom-in duration-700 border-2 border-[#CCA43B]"
            />
          </div>
        </div>
      </section>

      {/* Webinars Section */}
      {webinars.length > 0 && (
        <section id="webinars" className="py-12 md:py-20 bg-white/50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-bold text-[#1D2A38] mb-4">
                  Register for Our Free Webinar
                </h2>
                <p className="text-xl text-gray-700">
                  Get Your Freedom Matrix Score & Personalized Action Plan
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {webinars.map((webinar) => (
                  <Link key={webinar.id} href={`/live-webinar/${webinar.id}`}>
                    <Card className="h-full bg-white border-gray-200 shadow-md hover:shadow-xl hover:border-[#CCA43B] transition-all cursor-pointer">
                      {webinar.thumbnail && (
                        <div className="w-full h-48 overflow-hidden rounded-t-lg">
                          <img
                            src={webinar.thumbnail}
                            alt={webinar.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <Badge
                            className={
                              webinar.webinarStatus === WebinarStatusEnum.LIVE
                                ? 'bg-red-600 text-white'
                                : 'bg-[#CCA43B] text-[#1D2A38]'
                            }
                          >
                            {webinar.webinarStatus === WebinarStatusEnum.LIVE && (
                              <span className="mr-1 h-2 w-2 bg-white rounded-full animate-pulse"></span>
                            )}
                            {webinar.webinarStatus}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {webinar._count.attendances} registered
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-[#1D2A38] mb-3 line-clamp-2">
                          {webinar.title}
                        </h3>
                        <p className="text-gray-700 mb-4 line-clamp-2">
                          {webinar.description || 'Join this transformative webinar'}
                        </p>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(webinar.startTime).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {new Date(webinar.startTime).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                            {webinar.duration && ` (${webinar.duration} min)`}
                          </div>
                        </div>
                        <Button className="w-full mt-6 bg-[#CCA43B] hover:bg-[#CCA43B]/90 text-[#1D2A38] font-semibold">
                          Register Now
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Bonus Section */}
      <section className="py-12 md:py-20 bg-gray-100/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1D2A38] mb-8">
              Bonus: What You'll Receive
            </h2>
            <div className="space-y-4 text-lg text-gray-700">
              <div className="flex items-center justify-center gap-3">
                <span className="text-[#CCA43B] text-2xl">🎁</span>
                <span>Your Freedom Matrix Summary PDF</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <span className="text-[#CCA43B] text-2xl">🎁</span>
                <span>Recommended next steps based on your quadrant</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <span className="text-[#CCA43B] text-2xl">🎁</span>
                <span>Early access to the Freedom Framework™ Series</span>
              </div>
            </div>
          </div>
        </div>
      </section>

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
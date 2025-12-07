import { prismaClient } from '@/lib/prismaClient';
import { WebinarStatusEnum } from '@prisma/client';
import Link from 'next/link';
import { Calendar, Clock, CheckCircle2, Award, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    <div className="min-h-screen bg-gradient-to-br from-[#1D2A38] via-[#3A4750] to-[#1D2A38]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-[#CCA43B] text-[#1D2A38] hover:bg-[#CCA43B]/90 text-sm font-semibold px-4 py-2">
              FREEDOM FRAMEWORK™
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
              Discover Your Firm's
              <span className="block text-[#CCA43B]">Freedom Score</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Take the 5-minute assessment used by 7- and 8-figure law firm owners to diagnose operational bottlenecks and map their path to true time + financial freedom.
            </p>
            {webinars.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="#webinars">
                  <Button size="lg" className="bg-[#CCA43B] hover:bg-[#CCA43B]/90 text-[#1D2A38] font-semibold text-lg px-8 py-6">
                    Register for Free Webinar
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold text-lg px-8 py-6">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why This Matters Section */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 text-center">
              Why This Matters
            </h2>
            <div className="prose prose-lg prose-invert mx-auto">
              <p className="text-xl text-gray-300 leading-relaxed mb-6">
                You didn't build your law firm to work 60 hours a week.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                And yet—most high-performing firms end up either:
              </p>
              <ul className="space-y-3 text-lg text-gray-300 mb-6">
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
              <p className="text-lg text-gray-300 leading-relaxed">
                A firm that funds your life and gives you back your time. Find out exactly where your firm stands today.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-12 text-center">
              What You'll Learn
            </h2>
            <p className="text-xl text-gray-300 mb-8 text-center">
              This diagnostic reveals:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-[#CCA43B] flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Your Freedom Matrix Position</h3>
                      <p className="text-gray-300">Discover your firm's current quadrant on the Freedom Matrix</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-[#CCA43B] flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Hidden Freedom Traps</h3>
                      <p className="text-gray-300">Whether your billing model is creating hidden "freedom traps"</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-[#CCA43B] flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Fastest Path Forward</h3>
                      <p className="text-gray-300">The one operational shift that will unlock the fastest results</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-[#CCA43B] flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Distance to Freedom</h3>
                      <p className="text-gray-300">How close you really are to the Freedom Zone</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Four Quadrants Section */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-12 text-center">
              The Four Quadrants
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-red-900/40 to-red-800/40 border-red-500/30">
                <CardContent className="p-8">
                  <Award className="w-12 h-12 text-red-400 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-3">Grind Zone</h3>
                  <p className="text-gray-300">High effort, low return. Working hard but not seeing the financial freedom you deserve.</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 border-blue-500/30">
                <CardContent className="p-8">
                  <Target className="w-12 h-12 text-blue-400 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-3">Drift Zone</h3>
                  <p className="text-gray-300">Low activity, low results. Lacking direction and momentum in your practice.</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-amber-900/40 to-amber-800/40 border-amber-500/30">
                <CardContent className="p-8">
                  <TrendingUp className="w-12 h-12 text-amber-400 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-3">Golden Cage</h3>
                  <p className="text-gray-300">Profitable but trapped. Making money but owner-dependent and can't step away.</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-[#CCA43B]/40 to-[#CCA43B]/60 border-[#CCA43B]">
                <CardContent className="p-8">
                  <Award className="w-12 h-12 text-white mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-3">Freedom Zone</h3>
                  <p className="text-white">The goal: A firm that funds your life and gives you back your time.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Webinars Section */}
      {webinars.length > 0 && (
        <section id="webinars" className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  Register for Our Free Webinar
                </h2>
                <p className="text-xl text-gray-300">
                  Get Your Freedom Matrix Score & Personalized Action Plan
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {webinars.map((webinar) => (
                  <Link key={webinar.id} href={`/live-webinar/${webinar.id}`}>
                    <Card className="h-full bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 hover:border-[#CCA43B]/50 transition-all cursor-pointer">
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
                          <span className="text-sm text-gray-400">
                            {webinar._count.attendances} registered
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                          {webinar.title}
                        </h3>
                        <p className="text-gray-300 mb-4 line-clamp-2">
                          {webinar.description || 'Join this transformative webinar'}
                        </p>
                        <div className="space-y-2 text-sm text-gray-400">
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
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Bonus: What You'll Receive
            </h2>
            <div className="space-y-4 text-lg text-gray-300">
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
      <footer className="py-12 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 mb-2">
            Freedom Framework™ for Law Firm Owners
          </p>
          <p className="text-gray-500 text-sm">
            © 2025 All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
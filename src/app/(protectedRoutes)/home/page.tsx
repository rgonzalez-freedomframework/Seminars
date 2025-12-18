import React from 'react';
import { prismaClient } from '@/lib/prismaClient';
import { WebinarStatusEnum } from '@prisma/client';
import { auth, currentUser } from '@clerk/nextjs/server';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Calendar, Clock, PlayCircle, Shield, FileText, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { checkAndUpdateExpiredWebinars } from '@/actions/webinarManagement';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { WebinarCardDate, WebinarCardTime } from './_components/WebinarCardDateTimeClient';
import AvailableWebinarCard from './_components/AvailableWebinarCard';
import { onAuthenticateUser } from '@/actions/auth';

const Pages = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  const authResult = await onAuthenticateUser();
  const appUser = authResult.user;

  const parseSeatsFromTags = (tags: string[] | null): { seatsRemaining: number | null; seatsTotal: number | null } => {
    if (!tags || tags.length === 0) {
      return { seatsRemaining: null, seatsTotal: null };
    }

    const seatTag = tags.find((tag) => tag.startsWith('seats:'));
    if (!seatTag) {
      return { seatsRemaining: null, seatsTotal: null };
    }

    const value = seatTag.replace('seats:', '').trim();
    const [remainingStr, totalStr] = value.split('/');

    const remaining = remainingStr ? Number.parseInt(remainingStr, 10) : NaN;
    const total = totalStr ? Number.parseInt(totalStr, 10) : NaN;

    if (!Number.isFinite(remaining) || !Number.isFinite(total)) {
      return { seatsRemaining: null, seatsTotal: null };
    }

    return {
      seatsRemaining: Math.max(0, remaining),
      seatsTotal: Math.max(0, total),
    };
  };
  
  // Check and update any expired webinars before displaying
  await checkAndUpdateExpiredWebinars();
  
  // Check if user is admin using Clerk's publicMetadata
  // You can set this via Clerk Dashboard: Users → Select User → Metadata → Public metadata: {"role": "admin"}
  // Or programmatically via Clerk API
  const isAdmin = user?.publicMetadata?.role === 'admin' || 
    user?.emailAddresses.some(email => email.emailAddress === 'rgonzalez@freedomframework.us');
  // Get all upcoming and live webinars for users, plus whether this user is registered
  let webinarsForDisplay: Array<any> = [];

  if (appUser) {
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
        attendances: {
          where: {
            OR: [
              {
                userId: appUser.id,
              },
              {
                user: {
                  email: appUser.email,
                },
              },
            ],
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    webinarsForDisplay = webinars.map((webinar) => {
      const { seatsRemaining, seatsTotal } = parseSeatsFromTags(webinar.tags);

      return {
        ...webinar,
        isRegistered: webinar.attendances.length > 0,
        seatsRemaining,
        seatsTotal,
      };
    });
  } else {
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
    });

    webinarsForDisplay = webinars.map((webinar) => {
      const { seatsRemaining, seatsTotal } = parseSeatsFromTags(webinar.tags);

      return {
        ...webinar,
        isRegistered: false,
        seatsRemaining,
        seatsTotal,
      };
    });
  }

  // Get resources only for webinars where the current user is registered/attended
  const userResources = appUser
    ? await prismaClient.webinar.findMany({
        where: {
          webinarStatus: {
            not: WebinarStatusEnum.CANCELLED,
          },
          resources: {
            some: {},
          },
          attendances: {
            some: {
              OR: [
                {
                  userId: appUser.id,
                },
                {
                  user: {
                    email: appUser.email,
                  },
                },
              ],
            },
          },
        },
        include: {
          resources: {
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
        orderBy: {
          startTime: 'desc',
        },
      })
    : [];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-300 bg-gray-50/95 backdrop-blur supports-[backdrop-filter]:bg-gray-50/60">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
              <Link href="/webinar-registration" className="text-xl font-bold text-[#1D2A38] hover:text-[#CCA43B] transition-colors">
                Freedom Framework™
              </Link>
          </div>
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link href="/admin/webinars">
                  <Button variant="outline" size="sm" className="gap-2 !bg-white !border-2 !border-[#1D2A38] !text-[#1D2A38] hover:!bg-[#1D2A38] hover:!text-white transition-all">
                    <Shield className="w-4 h-4" />
                    Admin Panel
                  </Button>
                </Link>
              )}
              {userId ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <Link href="/sign-in">
                  <Button size="sm" className="bg-[#CCA43B] hover:bg-[#CCA43B]/90 text-[#1D2A38] font-semibold">Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-8">
        <div className="mb-8">
          <h1 className="text-[#1D2A38] font-semibold text-4xl mb-2">
            Welcome {user?.firstName || 'Back'}!
          </h1>
          <p className="text-gray-700 text-lg">
            Access your registered webinars and exclusive content
          </p>
        </div>

      {/* Upcoming Webinars Section */}
      <div className="mb-12">
        <h2 className="text-[#1D2A38] font-semibold text-2xl mb-6">
          Available Webinars
        </h2>
        {webinarsForDisplay.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {webinarsForDisplay.map((webinar) => (
              <AvailableWebinarCard
                key={webinar.id}
                webinar={webinar}
                currentUserId={appUser?.id || ''}
                defaultName={user?.firstName ? `${user.firstName} ${user.lastName ?? ''}`.trim() : undefined}
                defaultEmail={user?.emailAddresses?.[0]?.emailAddress}
              />
            ))}
          </div>
        ) : (
          <Card className="bg-white border-2 border-gray-300">
            <CardContent className="py-16 text-center">
              <p className="text-gray-600 text-lg mb-4">
                No webinars available at the moment
              </p>
              <p className="text-sm text-gray-600">
                Check back soon for new content!
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Resources Section */}
      <div>
        <h2 className="text-[#1D2A38] font-semibold text-2xl mb-6 flex items-center gap-2">
          <FileText className="w-6 h-6" />
          Your Resources
        </h2>
        {userResources.length > 0 ? (
          <div className="space-y-4">
            {userResources.map((webinar) => (
              <Collapsible key={webinar.id} defaultOpen={false}>
                <Card className="bg-white border-2 border-gray-300 hover:border-[#CCA43B] transition-colors">
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 hover:bg-gray-50/50 transition-colors rounded-t-lg">
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-[#CCA43B] mt-1 flex-shrink-0" />
                        <div className="text-left">
                          <CardTitle className="text-[#1D2A38] text-lg mb-1">{webinar.title}</CardTitle>
                          <p className="text-sm text-gray-600">
                            {webinar.resources.length} resource{webinar.resources.length !== 1 ? 's' : ''} available
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Intl.DateTimeFormat('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                              timeZoneName: 'short',
                            }).format(new Date(webinar.startTime))}
                          </p>
                        </div>
                      </div>
                      <ChevronDown className="w-5 h-5 text-gray-600 group-data-[state=open]:rotate-180 transition-transform flex-shrink-0" />
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-4 space-y-3">
                      {webinar.resources
                        .filter((resource) => !!resource.fileUrl)
                        .map((resource) => (
                        <div
                          key={resource.id}
                          className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#CCA43B] transition-colors group"
                        >
                          <div className="flex-1 min-w-0 mr-4">
                            <h3 className="font-semibold text-[#1D2A38] mb-1">{resource.title}</h3>
                            {resource.description && (
                              <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>{resource.fileName}</span>
                              {resource.fileSize && (
                                <span>{(resource.fileSize / (1024 * 1024)).toFixed(2)} MB</span>
                              )}
                              {resource.fileType && (
                                <span className="uppercase">{resource.fileType.split('/')[1]}</span>
                              )}
                            </div>
                          </div>
                          <a
                            href={resource.fileUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0"
                          >
                            <Button
                              size="sm"
                              className="bg-[#CCA43B] hover:bg-[#CCA43B]/90 text-[#1D2A38] font-semibold"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </a>
                        </div>
                        ))}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        ) : (
          <Card className="bg-white border-2 border-gray-300">
            <CardContent className="py-16 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">
                No resources available yet
              </p>
              <p className="text-sm text-gray-500">
                Resources from webinars you attend will appear here
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      </div>
    </div>
  );
};

export default Pages;
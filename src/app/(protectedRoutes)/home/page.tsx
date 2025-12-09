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

const Pages = async () => {
  const { userId } = await auth();
  const user = await currentUser();
  
  // Check and update any expired webinars before displaying
  await checkAndUpdateExpiredWebinars();
  
  // Check if user is admin using Clerk's publicMetadata
  // You can set this via Clerk Dashboard: Users → Select User → Metadata → Public metadata: {"role": "admin"}
  // Or programmatically via Clerk API
  const isAdmin = user?.publicMetadata?.role === 'admin' || 
    user?.emailAddresses.some(email => email.emailAddress === 'rgonzalez@freedomframework.us');
  // Get all upcoming and live webinars for users
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

  // Get resources from webinars that have resources available
  // TODO: Filter by user attendance when attendance tracking is fully implemented
  const userResources = await prismaClient.webinar.findMany({
    where: {
      resources: {
        some: {},
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
  });

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-300 bg-gray-50/95 backdrop-blur supports-[backdrop-filter]:bg-gray-50/60">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
              <Link href="/?view=landing" className="text-xl font-bold text-[#1D2A38] hover:text-[#CCA43B] transition-colors">
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
        {webinars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {webinars.map((webinar) => (
              <Link key={webinar.id} href={`/live-webinar/${webinar.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 border-gray-300 bg-white hover:border-[#CCA43B]">
                  {webinar.thumbnail && (
                    <div className="w-full h-48 overflow-hidden rounded-t-lg relative">
                      <img
                        src={webinar.thumbnail}
                        alt={webinar.title}
                        className="w-full h-full object-cover"
                      />
                      {webinar.webinarStatus === WebinarStatusEnum.LIVE && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-red-600 text-white">
                            <span className="mr-1 h-2 w-2 bg-white rounded-full animate-pulse"></span>
                            LIVE NOW
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant={
                          webinar.webinarStatus === WebinarStatusEnum.LIVE
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {webinar.webinarStatus}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {webinar._count.attendances} attending
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2 text-[#1D2A38]">{webinar.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {webinar.description || 'Join this exclusive webinar'}
                    </p>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(webinar.startTime).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
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
                    <Button className="w-full bg-[#CCA43B] hover:bg-[#CCA43B]/90 text-[#1D2A38] font-semibold transition-all" variant="default">
                      <PlayCircle className="w-4 h-4 mr-2" />
                      {webinar.webinarStatus === WebinarStatusEnum.LIVE ? 'Join Now' : 'View Details'}
                    </Button>
                  </CardContent>
                </Card>
              </Link>
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
                            {new Date(webinar.startTime).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
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
import { prismaClient } from '@/lib/prismaClient';
import { WebinarStatusEnum } from '@prisma/client';
import Link from 'next/link';
import { Calendar, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { checkAndUpdateExpiredWebinars } from '@/actions/webinarManagement';

export default async function LiveWebinarIndexPage() {
  // Check and update any expired webinars before displaying
  await checkAndUpdateExpiredWebinars();
  
  // Get all upcoming and live webinars
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

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Free Webinars
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join our upcoming webinars and learn from industry experts. Register now to secure your spot!
          </p>
        </div>

        {webinars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {webinars.map((webinar) => (
              <Link key={webinar.id} href={`/live-webinar/${webinar.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  {webinar.thumbnail && (
                    <div className="w-full h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={webinar.thumbnail}
                        alt={webinar.title}
                        className="w-full h-full object-cover"
                      />
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
                        {webinar.webinarStatus === WebinarStatusEnum.LIVE && (
                          <span className="mr-1 h-2 w-2 bg-white rounded-full animate-pulse"></span>
                        )}
                        {webinar.webinarStatus}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="w-4 h-4 mr-1" />
                        {webinar._count.attendances} registered
                      </div>
                    </div>
                    <CardTitle className="line-clamp-2">{webinar.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {webinar.description || 'Join this exciting webinar'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Intl.DateTimeFormat('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                        }).format(new Date(webinar.startTime))}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2" />
                        {new Intl.DateTimeFormat('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                          timeZoneName: 'short',
                        }).format(new Date(webinar.startTime))}
                        {webinar.duration && ` (${webinar.duration} min)`}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <span className="font-semibold">Host:</span>
                        <span className="ml-2">{webinar.presenter.name}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">
              No webinars available at the moment. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

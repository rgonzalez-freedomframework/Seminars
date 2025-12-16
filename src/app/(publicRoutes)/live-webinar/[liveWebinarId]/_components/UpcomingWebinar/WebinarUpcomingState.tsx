'use client';

import React, { useMemo, useState } from 'react';
import { User, Webinar, WebinarStatusEnum } from "@prisma/client";
import CountdownTimer from './CountdownTimer';
import WaitlistComponent from './WaitlistComponent';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Loader2 } from 'lucide-react';
import { changeWebinarStatus } from '@/actions/webinar';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
type Props = {
  webinar: Webinar;
  currentUser: User | null;
};

const WebinarUpcomingState = ({ webinar, currentUser }: Props) => {
  const [loading, setLoading] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const router = useRouter();

    const handleStartWebinar = async () => {
    setLoading(true);
    try {
        const res = await changeWebinarStatus(webinar.id, WebinarStatusEnum.LIVE);
        if (!res.success) {
        throw new Error(res.message);
        }
        toast.success('Webinar started successfully');
        router.refresh();
    } catch (error) {
        console.log(error);
        toast.error('Something went wrong');
    } finally {
        setLoading(false);
    }
    }

  const isZoomWebinar = useMemo(
    () => Boolean(webinar.zoomJoinUrl),
    [webinar.zoomJoinUrl]
  );

  const handleImageClick = () => {
    // Only allow clicking through to Zoom once the countdown
    // has expired and this is a Zoom-based webinar.
    if (!isZoomWebinar || !isExpired) return;

    if (webinar.zoomJoinUrl) {
      window.open(webinar.zoomJoinUrl, '_blank');
    }
  };

  const startDate = new Date(webinar.startTime);
  const durationMinutes = webinar.duration && webinar.duration > 0 ? webinar.duration : 120;
  const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);

  const calendarDetailsParts: string[] = [];
  if (webinar.description) {
    calendarDetailsParts.push(webinar.description);
  }
  if (webinar.zoomJoinUrl) {
    calendarDetailsParts.push(`Join link: ${webinar.zoomJoinUrl}`);
  }
  if (webinar.zoomWebinarId) {
    calendarDetailsParts.push(`Meeting ID: ${webinar.zoomWebinarId}`);
  }
  if (webinar.zoomPassword) {
    calendarDetailsParts.push(`Passcode: ${webinar.zoomPassword}`);
  }

  const calendarDetails = calendarDetailsParts.join('\n\n');

  const formatGoogleDate = (date: Date) => {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    const hh = String(date.getUTCHours()).padStart(2, '0');
    const mm = String(date.getUTCMinutes()).padStart(2, '0');
    const ss = String(date.getUTCSeconds()).padStart(2, '0');
    return `${y}${m}${d}T${hh}${mm}${ss}Z`;
  };

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    webinar.title
  )}&dates=${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}&details=${encodeURIComponent(
    calendarDetails
  )}&location=${encodeURIComponent(webinar.zoomJoinUrl || '')}`;

  const outlookCalendarUrl = `https://outlook.office.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&startdt=${encodeURIComponent(
    startDate.toISOString()
  )}&enddt=${encodeURIComponent(endDate.toISOString())}&subject=${encodeURIComponent(
    webinar.title
  )}&body=${encodeURIComponent(calendarDetails)}&location=${encodeURIComponent(webinar.zoomJoinUrl || '')}`;
  return (
	  <div className="w-full min-h-screen relative overflow-hidden bg-[#F6F7F4]">

      <div className="relative z-10 w-full min-h-screen mx-auto max-w-[500px] flex flex-col justify-center items-center gap-8 py-20 px-4">
      <div className="space-y-6 animate-in fade-in slide-in-from-top duration-700">
        {!isZoomWebinar || !isExpired ? (
          <>
            <p className="text-3xl md:text-4xl font-bold text-[#1D2A38] text-center leading-tight">
              Seems like you are <span className="text-[#CCA43B]">a little early</span>
            </p>
            <CountdownTimer
              targetDate={new Date(webinar.startTime)}
              className="text-center animate-in fade-in slide-in-from-bottom duration-700 delay-150"
              webinarId={webinar.id}
              webinarStatus={webinar.webinarStatus}
              onExpired={() => setIsExpired(true)}
            />
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="outline"
                className="rounded-xl bg-white border-2 border-[#1D2A38] text-[#1D2A38] hover:bg-[#1D2A38] hover:text-white font-semibold transition-all text-sm"
                onClick={() => window.open(googleCalendarUrl, '_blank')}
              >
                Add to Google Calendar
              </Button>
              <Button
                variant="outline"
                className="rounded-xl bg-white border-2 border-[#1D2A38] text-[#1D2A38] hover:bg-[#1D2A38] hover:text-white font-semibold transition-all text-sm"
                onClick={() => window.open(outlookCalendarUrl, '_blank')}
              >
                Add to Outlook Calendar
              </Button>
            </div>
          </>
        ) : (
          <p className="text-3xl md:text-4xl font-bold text-[#1D2A38] text-center leading-tight">
            Your webinar is starting now. <span className="text-[#CCA43B]">Join on Zoom</span>
          </p>
        )}
      </div>

        <div className="space-y-6 w-full h-full flex justify-center items-center flex-col animate-in fade-in zoom-in duration-700 delay-300">
        <div
          className={`w-full max-w-md aspect-[4/3] relative rounded-2xl overflow-hidden mb-6 shadow-2xl border-4 border-[#CCA43B]/20 transition-all duration-300 ${
            isZoomWebinar && isExpired
              ? 'hover:border-[#CCA43B]/40 hover:scale-[1.02] cursor-pointer'
              : 'cursor-default'
          }`}
          onClick={handleImageClick}
        >
            <Image
            src={webinar.thumbnail || '/aieracourse.png'}
            alt={webinar.title}
            fill
            className="object-cover"
            priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1D2A38]/20 to-transparent"></div>
        </div>
        {/* If this is a Zoom webinar and the countdown has finished, show join details instead of waitlist/start buttons */}
        {isZoomWebinar && isExpired ? (
          <div className="w-full max-w-md space-y-4 rounded-2xl border border-gray-200 bg-white/80 shadow-lg p-6">
            <h2 className="text-xl font-bold text-[#1D2A38] text-center">
              Join this webinar on Zoom
            </h2>
            <p className="text-sm text-gray-600 text-center">
              Click the link below to open Zoom. You can wait in the Zoom waiting room until the host starts the session.
            </p>

            <div className="space-y-3 rounded-xl bg-gray-50 border border-gray-200 p-4 text-sm">
              {webinar.zoomWebinarId && (
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium text-gray-700">Meeting ID:</span>
                  <span className="font-mono text-gray-900 break-all">
                    {webinar.zoomWebinarId}
                  </span>
                </div>
              )}
              {webinar.zoomPassword && (
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium text-gray-700">Passcode:</span>
                  <span className="font-mono text-gray-900 break-all">
                    {webinar.zoomPassword}
                  </span>
                </div>
              )}
              {webinar.zoomJoinUrl && (
                <div className="flex flex-col gap-2">
                  <span className="font-medium text-gray-700">Join link:</span>
                  <a
                    href={webinar.zoomJoinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-mono text-blue-700 underline break-all"
                  >
                    {webinar.zoomJoinUrl}
                  </a>
                </div>
              )}
            </div>

            {webinar.zoomJoinUrl && (
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Button
                  className="flex-1 bg-gradient-to-r from-[#CCA43B] to-[#B8932F] hover:from-[#B8932F] hover:to-[#CCA43B] text-[#1D2A38] font-semibold border-2 border-[#CCA43B] rounded-xl"
                  onClick={() => {
                    window.open(webinar.zoomJoinUrl as string, '_blank');
                  }}
                >
                  Open Zoom Link
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 !border-2 !border-[#1D2A38]/40 !bg-[#F6F7F4] !text-[#1D2A38] hover:!bg-[#1D2A38]/5"
                  onClick={() => {
                    navigator.clipboard
                      .writeText(webinar.zoomJoinUrl as string)
                      .catch(() => {});
                  }}
                >
                  Copy Join Link
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 !border-2 !border-[#1D2A38]/40 !bg-[#F6F7F4] !text-[#1D2A38] hover:!bg-[#1D2A38]/5"
                  onClick={() => router.push('/home')}
                >
                  Go to Dashboard
                </Button>
              </div>
            )}
          </div>
        ) : webinar?.webinarStatus === WebinarStatusEnum.SCHEDULED ? (
            <WaitlistComponent webinarId={webinar.id} webinarStatus="SCHEDULED" />
        ) : webinar?.webinarStatus === WebinarStatusEnum.WAITING_ROOM ? (
            <>
                {currentUser?.id === webinar?.presenterId ? (
                <Button
                className="w-full max-w-[300px] font-semibold bg-gradient-to-r from-[#CCA43B] to-[#B8932F] hover:from-[#B8932F] hover:to-[#CCA43B] text-[#1D2A38] border-2 border-[#CCA43B] rounded-xl"
                onClick={handleStartWebinar}
                disabled={loading}
                >
                {loading ? (
                    <>
                    <Loader2 className="animate-spin mr-2" />
                    Starting...
                    </>
                ) : (
                    'Start Webinar'
                )}
                </Button>
            ) : (
                <WaitlistComponent
                    webinarId={webinar.id}
                    webinarStatus='WAITING_ROOM'
                />
            )} </>
        ): webinar?.webinarStatus === WebinarStatusEnum.LIVE ? (
        <WaitlistComponent webinarId={webinar.id} webinarStatus="LIVE" />
        ) : webinar?.webinarStatus === WebinarStatusEnum.CANCELLED ? (
        <p className="text-xl text-foreground text-center font-semibold">
            Webinar is cancelled
        </p>
        ) : (
        <Button>Ended</Button>
            )}
            </div>
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom duration-700 delay-500">
        <h3 className="text-2xl md:text-3xl font-bold text-[#1D2A38] leading-tight">{webinar?.title}</h3>
        <p className="text-gray-600 text-sm md:text-base max-w-md mx-auto">{webinar?.description}</p>
        <div className="w-full justify-center flex gap-3 flex-wrap items-center">
            <Button variant="outline" className="rounded-xl bg-white border-2 border-[#1D2A38] text-[#1D2A38] hover:bg-[#1D2A38] hover:text-white font-semibold transition-all duration-300 hover:scale-105 shadow-md">
            <Calendar className="mr-2 w-4 h-4" />
            {new Date(webinar.startTime).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric',
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            })}
            </Button>
            <Button variant="outline" className="rounded-xl bg-white border-2 border-[#1D2A38] text-[#1D2A38] hover:bg-[#1D2A38] hover:text-white font-semibold transition-all duration-300 hover:scale-105 shadow-md">
            <Clock className="mr-2 w-4 h-4" />
            {new Date(webinar.startTime).toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true,
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            })}
            </Button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default WebinarUpcomingState;
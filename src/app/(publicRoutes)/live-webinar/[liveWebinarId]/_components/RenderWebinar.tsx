'use client'
import React, { useEffect } from 'react';
import { User, WebinarStatusEnum } from "@prisma/client";
import WebinarUpcomingState from './UpcomingWebinar/WebinarUpcomingState';
import WebinarEndedState from './EndedWebinar/WebinarEndedState';
import { usePathname, useRouter } from 'next/navigation';
import { useAttendeeStore } from '@/store/useAttendeeStore';
import { toast } from 'sonner';
import LiveStreamState from './LiveWebinar/LiveStreamState';
import PreRecordedVideoPlayer from './LiveWebinar/PreRecordedVideoPlayer';
import { WebinarWithPresenter } from '@/lib/type';
import { Button } from '@/components/ui/button';

type Props = {
  error: string | undefined;
  user: User | null;
  webinar: WebinarWithPresenter;
  apiKey: string;
  token: string;
  callId: string;
};


const RenderWebinar = ({
  error,
  user,
  webinar,
  apiKey,
  token,
  callId,
}: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const { attendee } = useAttendeeStore();

    useEffect(() => {
    if (error) {
        toast .error(error);
        router.push(pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error]);
  // Check if this is a pre-recorded webinar
  if (webinar?.isPreRecorded && webinar?.videoUrl) {
    return <PreRecordedVideoPlayer webinar={webinar} user={user} />
  }

  return (
    <React.Fragment>
        {webinar?.webinarStatus === WebinarStatusEnum.SCHEDULED ? (
            <WebinarUpcomingState webinar={webinar} currentUser={user || null} />
        ) : webinar?.webinarStatus === WebinarStatusEnum.WAITING_ROOM ? (
            <WebinarUpcomingState webinar={webinar} currentUser={user || null} />
        ) : webinar?.webinarStatus === WebinarStatusEnum.LIVE ? (
           <React.Fragment>
                {user?.id === webinar?.presenterId ? (
                // Show livestream controls for presenter (host)
                <LiveStreamState apiKey={apiKey} token={token} callId={callId} webinar={webinar} user={user}/>
                ) : webinar.zoomJoinUrl ? (
                // Show Zoom join details instead of embedding the Zoom Web SDK
                <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-white px-4 py-12">
                  <div className="max-w-lg w-full space-y-6 rounded-2xl border border-gray-200 bg-white/80 shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-[#1D2A38] text-center">
                      Join This Webinar on Zoom
                    </h2>
                    <p className="text-sm text-gray-600 text-center">
                      This session is hosted on Zoom. Click the button below to
                      open Zoom in a new tab, then use the meeting details if
                      prompted.
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
                    </div>

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
                  </div>
                </div>
                ) : attendee ? (
                // Fallback to livestream participant view if no Zoom
                // <Participant apiKey={apiKey} token={token} callId={callId} />
                <WebinarUpcomingState webinar={webinar} currentUser={user || null} />
                ) : (
                // Show registration if not registered yet
                <WebinarUpcomingState webinar={webinar} currentUser={user || null} />
                )}
            </React.Fragment>
            ): webinar?.webinarStatus === WebinarStatusEnum.ENDED ? (
            <WebinarEndedState webinar={webinar} currentUser={user || null} />
            ): webinar?.webinarStatus === WebinarStatusEnum.CANCELLED ? (
            <div className="flex justify-center items-center h-full w-full">
                <div className="text-center space-y-4">
                <h3 className="text-2xl font-semibold text-primary">{webinar?.title}</h3>
                <p className="text-muted-foreground text-xs">This webinar has been cancelled.</p>
                </div>
            </div>
            ) : (
                 <WebinarUpcomingState webinar={webinar} currentUser={user || null} />
            )}
    </React.Fragment>
  )
}

export default RenderWebinar;  
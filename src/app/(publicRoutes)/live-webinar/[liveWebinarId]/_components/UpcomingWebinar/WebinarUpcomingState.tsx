'use client';

import React, { useState } from 'react';
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
  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#CCA43B]/5 rounded-full blur-3xl animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#1D2A38]/5 rounded-full blur-3xl animate-pulse" style={{animationDuration: '6s', animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#CCA43B]/3 rounded-full blur-3xl animate-pulse" style={{animationDuration: '8s', animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 w-full min-h-screen mx-auto max-w-[500px] flex flex-col justify-center items-center gap-8 py-20 px-4">
      <div className="space-y-6 animate-in fade-in slide-in-from-top duration-700">
        <p className="text-3xl md:text-4xl font-bold text-[#1D2A38] text-center leading-tight">
          Seems like you are <span className="text-[#CCA43B]">a little early</span>
        </p>
        <CountdownTimer
          targetDate={new Date(webinar.startTime)}
          className="text-center animate-in fade-in slide-in-from-bottom duration-700 delay-150"
          webinarId={webinar.id}
          webinarStatus={webinar.webinarStatus}
        />
      </div>

        <div className="space-y-6 w-full h-full flex justify-center items-center flex-col animate-in fade-in zoom-in duration-700 delay-300">
        <div className="w-full max-w-md aspect-[4/3] relative rounded-2xl overflow-hidden mb-6 shadow-2xl border-4 border-[#CCA43B]/20 hover:border-[#CCA43B]/40 transition-all duration-300 hover:scale-[1.02]">
            <Image
            src={webinar.thumbnail || '/aieracourse.png'}
            alt={webinar.title}
            fill
            className="object-cover"
            priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1D2A38]/20 to-transparent"></div>
        </div>
        {webinar?.webinarStatus === WebinarStatusEnum.SCHEDULED ? (
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
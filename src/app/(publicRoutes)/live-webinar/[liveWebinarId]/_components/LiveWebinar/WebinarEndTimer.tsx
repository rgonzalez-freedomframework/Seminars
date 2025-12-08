'use client'

import { changeWebinarStatus } from '@/actions/webinar';
import { WebinarStatusEnum } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type Props = {
  webinarId: string;
  startTime: Date;
  duration: number; // duration in minutes
  webinarStatus: WebinarStatusEnum;
};

const WebinarEndTimer = ({
  webinarId,
  startTime,
  duration,
  webinarStatus,
}: Props) => {
  const [isEnded, setIsEnded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Only run the timer if the webinar is LIVE
    if (webinarStatus !== WebinarStatusEnum.LIVE) return;

    const checkWebinarEnd = async () => {
      const now = new Date();
      const start = new Date(startTime);
      const endTime = new Date(start.getTime() + duration * 60000); // duration in milliseconds
      
      const timeRemaining = endTime.getTime() - now.getTime();

      // If time has expired and we haven't ended it yet
      if (timeRemaining <= 0 && !isEnded) {
        setIsEnded(true);
        
        try {
          const result = await changeWebinarStatus(
            webinarId,
            WebinarStatusEnum.ENDED
          );
          
          if (result.success) {
            toast.success('Webinar has ended');
            router.refresh();
          } else {
            console.error('Failed to end webinar:', result.message);
          }
        } catch (error) {
          console.error('Error ending webinar:', error);
        }
      }
    };

    // Check immediately
    checkWebinarEnd();

    // Check every 10 seconds
    const interval = setInterval(checkWebinarEnd, 10000);

    return () => clearInterval(interval);
  }, [webinarId, startTime, duration, webinarStatus, isEnded, router]);

  return null; // This is a logic-only component, no UI
};

export default WebinarEndTimer;

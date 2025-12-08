import { changeWebinarStatus } from '@/actions/webinar';
import { cn } from '@/lib/utils';
import { WebinarStatusEnum } from '@prisma/client';
import React, { useEffect, useState } from 'react';

type Props = {
  targetDate: Date;
  className?: string;
  webinarId: string;
  webinarStatus: WebinarStatusEnum;
};

const CountdownTimer = ({
  targetDate,
  className,
  webinarId,
  webinarStatus,
}: Props) => {
  const [isExpired, setIsExpired] = useState(false);
    const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
    });
    // Format numbers to always have two digits
    const formatNumber = (num: number) => num.toString().padStart(2, '0');

    const splitDigits = (num: number) => {
    const formatted = formatNumber(num);
    return [formatted.charAt(0), formatted.charAt(1)];
    };
    const [days1, days2] = splitDigits(timeLeft.days > 99 ? 99 : timeLeft.days);
    const [hours1, hours2] = splitDigits(timeLeft.hours);
    const [minutes1, minutes2] = splitDigits(timeLeft.minutes);
    const [seconds1, seconds2] = splitDigits(timeLeft.seconds);

    useEffect(() => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    if (difference <= 0) {
      if (!isExpired) {
        setIsExpired(true);
      if (webinarStatus === WebinarStatusEnum.SCHEDULED) {
        const updateStatus = async () => {
          try {
            await changeWebinarStatus(
              webinarId,
              WebinarStatusEnum.WAITING_ROOM
            )
          } catch (err) {
            console.error(err);
          }
        }
        // Call the async function separately
        updateStatus();
      }
    }
    return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        }
    }

    return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        milliseconds: difference % 1000,
        }
    }
    setTimeLeft(calculateTimeLeft())
    const timer=setInterval(()=>{
        setTimeLeft(calculateTimeLeft())
    },50)
    return () =>clearInterval(timer)
}, [isExpired, targetDate, webinarId, webinarStatus])
  return (
    <div className={cn('text-center', className)}>
        {!isExpired && (
            <div className="flex items-center justify-center gap-4 mb-8">
            {timeLeft.days > 0 && (
                <div className="space-y-2 animate-in fade-in zoom-in duration-500">
                <p className="text-sm font-semibold text-[#CCA43B] uppercase tracking-wider">Days</p>
                <div className="flex justify-center gap-1">
                    <div className="bg-gradient-to-br from-[#1D2A38] to-[#2D3A48] text-white w-14 h-16 flex items-center justify-center rounded-xl text-2xl font-bold shadow-lg border-2 border-[#CCA43B] transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    {days1}
                    </div>
                    <div className="bg-gradient-to-br from-[#1D2A38] to-[#2D3A48] text-white w-14 h-16 flex items-center justify-center rounded-xl text-2xl font-bold shadow-lg border-2 border-[#CCA43B] transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    {days2}
                    </div>
                </div>
                </div>
            )}

            <div className="space-y-2 animate-in fade-in zoom-in duration-500 delay-75">
            <p className="text-sm font-semibold text-[#CCA43B] uppercase tracking-wider">Hours</p>
            <div className="flex justify-center gap-1">
                <div className="bg-gradient-to-br from-[#1D2A38] to-[#2D3A48] text-white w-14 h-16 flex items-center justify-center rounded-xl text-2xl font-bold shadow-lg border-2 border-[#CCA43B] transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                {hours1}
                </div>
                <div className="bg-gradient-to-br from-[#1D2A38] to-[#2D3A48] text-white w-14 h-16 flex items-center justify-center rounded-xl text-2xl font-bold shadow-lg border-2 border-[#CCA43B] transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                {hours2}
                </div>
            </div>
            </div>
            <div className="space-y-2 animate-in fade-in zoom-in duration-500 delay-150">
        <p className="text-sm font-semibold text-[#CCA43B] uppercase tracking-wider">Minutes</p>
        <div className="flex justify-center gap-1">
            <div className="bg-gradient-to-br from-[#1D2A38] to-[#2D3A48] text-white w-14 h-16 flex items-center justify-center rounded-xl text-2xl font-bold shadow-lg border-2 border-[#CCA43B] transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            {minutes1}
            </div>
            <div className="bg-gradient-to-br from-[#1D2A38] to-[#2D3A48] text-white w-14 h-16 flex items-center justify-center rounded-xl text-2xl font-bold shadow-lg border-2 border-[#CCA43B] transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            {minutes2}
            </div>
        </div>
        </div>

            <div className="space-y-2 animate-in fade-in zoom-in duration-500 delay-200">
        <p className="text-sm font-semibold text-[#CCA43B] uppercase tracking-wider">Seconds</p>
        <div className="flex justify-center gap-1">
            <div className="bg-gradient-to-br from-[#1D2A38] to-[#2D3A48] text-white w-14 h-16 flex items-center justify-center rounded-xl text-2xl font-bold shadow-lg border-2 border-[#CCA43B] transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-pulse">
            {seconds1}
            </div>
            <div className="bg-gradient-to-br from-[#1D2A38] to-[#2D3A48] text-white w-14 h-16 flex items-center justify-center rounded-xl text-2xl font-bold shadow-lg border-2 border-[#CCA43B] transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-pulse">
            {seconds2}
            </div>
        </div>
        </div>

            </div>
        )}
    </div>
  );
};

export default CountdownTimer;
'use client';

import React from 'react';
import { User } from "@prisma/client";
import { WebinarWithPresenter } from '@/lib/type';
import Image from 'next/image';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

type Props = {
  webinar: WebinarWithPresenter;
  currentUser: User | null;
};

const WebinarEndedState = ({ webinar, currentUser }: Props) => {
  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#CCA43B]/5 rounded-full blur-3xl animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#1D2A38]/5 rounded-full blur-3xl animate-pulse" style={{animationDuration: '6s', animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#CCA43B]/3 rounded-full blur-3xl animate-pulse" style={{animationDuration: '8s', animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 w-full min-h-screen mx-auto max-w-[600px] flex flex-col justify-center items-center gap-8 py-20 px-4">
        {/* Ended Badge */}
        <div className="space-y-6 animate-in fade-in slide-in-from-top duration-700">
          <div className="flex items-center justify-center gap-3 bg-gray-100 border-2 border-gray-300 px-6 py-3 rounded-full">
            <CheckCircle2 className="w-6 h-6 text-gray-600" />
            <span className="text-lg font-semibold text-gray-700">Webinar Ended</span>
          </div>
        </div>

        {/* Webinar Image */}
        <div className="space-y-6 w-full h-full flex justify-center items-center flex-col animate-in fade-in zoom-in duration-700 delay-300">
          <div className="w-full max-w-md aspect-[4/3] relative rounded-2xl overflow-hidden mb-6 shadow-2xl border-4 border-gray-200 transition-all duration-300">
            <Image
              src={'/aieracourse.png'}
              alt={webinar.title}
              fill
              className="object-cover grayscale-[30%]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1D2A38]/40 to-transparent"></div>
          </div>
        </div>

        {/* Webinar Details */}
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom duration-700 delay-500">
          <h3 className="text-2xl md:text-3xl font-bold text-[#1D2A38] leading-tight">{webinar?.title}</h3>
          <p className="text-gray-600 text-sm md:text-base max-w-md mx-auto">{webinar?.description}</p>
          
          <div className="w-full justify-center flex gap-3 flex-wrap items-center pt-4">
            <div className="flex items-center gap-2 bg-white border-2 border-gray-200 px-4 py-2 rounded-xl shadow-sm">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {format(new Date(webinar.startTime), 'dd MMMM yyyy')}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white border-2 border-gray-200 px-4 py-2 rounded-xl shadow-sm">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {format(new Date(webinar.startTime), 'hh:mm a')}
              </span>
            </div>
          </div>

          {/* Thank you message */}
          <div className="mt-8 p-6 bg-gradient-to-br from-[#CCA43B]/10 to-[#CCA43B]/5 border-2 border-[#CCA43B]/20 rounded-2xl max-w-md mx-auto">
            <p className="text-[#1D2A38] font-semibold text-lg mb-2">
              Thank You for Attending!
            </p>
            <p className="text-gray-600 text-sm">
              We hope you found this webinar valuable. Keep an eye out for our upcoming events!
            </p>
          </div>

          {/* Host Info if presenter */}
          {currentUser?.id === webinar?.presenterId && (
            <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl max-w-md mx-auto">
              <p className="text-blue-900 font-medium text-sm">
                📊 View your webinar analytics and attendee data in the admin dashboard.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebinarEndedState;

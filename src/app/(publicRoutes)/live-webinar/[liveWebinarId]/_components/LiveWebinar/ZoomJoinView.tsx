'use client';

import React, { useEffect } from 'react';
import { WebinarWithPresenter } from '@/lib/type';
import { Button } from '@/components/ui/button';
import { ExternalLink, Video, Users, Clock } from 'lucide-react';
import { format } from 'date-fns';

type Props = {
  webinar: WebinarWithPresenter;
  autoJoin?: boolean;
};

const ZoomJoinView = ({ webinar, autoJoin = false }: Props) => {
  useEffect(() => {
    // Auto-redirect to Zoom if enabled and link exists
    if (autoJoin && webinar.zoomJoinUrl) {
      window.open(webinar.zoomJoinUrl, '_blank');
    }
  }, [autoJoin, webinar.zoomJoinUrl]);

  if (!webinar.zoomJoinUrl) {
    return (
	      <div className="w-full min-h-screen flex items-center justify-center bg-[#F6F7F4] p-4">
        <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-700">
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto bg-[#1D2A38] rounded-full flex items-center justify-center">
              <Video className="w-10 h-10 text-[#CCA43B]" />
            </div>
            <h1 className="text-3xl font-bold text-[#1D2A38]">
              Webinar is Live!
            </h1>
            <p className="text-gray-600">
              This webinar is currently live but no Zoom link is available. Please contact the host.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
	    <div className="w-full min-h-screen relative overflow-hidden bg-[#F6F7F4]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#CCA43B]/5 rounded-full blur-3xl animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#1D2A38]/5 rounded-full blur-3xl animate-pulse" style={{animationDuration: '6s', animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10 w-full min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
          {/* Live Indicator */}
          <div className="flex justify-center animate-in fade-in zoom-in duration-500">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full font-bold shadow-lg">
              <span className="h-3 w-3 bg-white rounded-full animate-pulse"></span>
              LIVE NOW
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-2xl border-4 border-[#CCA43B]/20 overflow-hidden animate-in fade-in zoom-in duration-700 delay-150">
            {/* Thumbnail */}
            {webinar.thumbnail && (
              <div className="w-full h-64 relative overflow-hidden">
                <img
                  src={webinar.thumbnail}
                  alt={webinar.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D2A38]/80 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h1 className="text-3xl font-bold text-white mb-2">{webinar.title}</h1>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-8 space-y-6">
              {!webinar.thumbnail && (
                <h1 className="text-3xl font-bold text-[#1D2A38]">{webinar.title}</h1>
              )}

              {webinar.description && (
                <p className="text-gray-600 text-lg">{webinar.description}</p>
              )}

              {/* Webinar Info */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#CCA43B]" />
                  <span>{format(new Date(webinar.startTime), 'MMM dd, yyyy • hh:mm a')}</span>
                </div>
                {webinar.duration && (
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-[#CCA43B]" />
                    <span>{webinar.duration} minutes</span>
                  </div>
                )}
              </div>

              {/* Presenter Info */}
              {webinar.presenter && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  {webinar.presenter.profileImage && (
                    <img
                      src={webinar.presenter.profileImage}
                      alt={webinar.presenter.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Hosted by</p>
                    <p className="font-semibold text-[#1D2A38]">{webinar.presenter.name}</p>
                  </div>
                </div>
              )}

              {/* Join Button */}
              <div className="space-y-3">
                <Button
                  onClick={() => window.open(webinar.zoomJoinUrl!, '_blank')}
                  className="w-full h-16 text-lg font-bold bg-gradient-to-r from-[#CCA43B] to-[#B8932F] hover:from-[#B8932F] hover:to-[#CCA43B] text-[#1D2A38] border-4 border-[#CCA43B] rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                >
                  <ExternalLink className="w-6 h-6 mr-3" />
                  Join Zoom Meeting
                </Button>
                
                <p className="text-center text-sm text-gray-500">
                  Opens in a new tab • No login required
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <Users className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">Quick Tips:</p>
                    <ul className="space-y-1 text-blue-800">
                      <li>• Click the button above to join the meeting</li>
                      <li>• You can join from your browser or Zoom app</li>
                      <li>• No Zoom account required</li>
                      <li>• Make sure your camera and microphone are ready</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZoomJoinView;

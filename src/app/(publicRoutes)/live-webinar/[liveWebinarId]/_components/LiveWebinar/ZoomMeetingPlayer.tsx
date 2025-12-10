'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

type Props = {
  meetingNumber: string;
  userName: string;
  userEmail?: string;
  passWord?: string;
  zoomJoinUrl?: string;
};

const ZoomMeetingPlayer = ({
  meetingNumber,
  userName,
  userEmail = '',
  passWord = '',
  zoomJoinUrl,
}: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const meetingSDKElement = useRef<HTMLDivElement>(null);
  const clientRef = useRef<any>(null);

  useEffect(() => {
    const initZoom = async () => {
      try {
        const { default: ZoomMtgEmbedded } = await import('@zoom/meetingsdk/embedded');
        // Initialize Zoom SDK
        const client = ZoomMtgEmbedded.createClient();
        clientRef.current = client;

        if (meetingSDKElement.current) {
          await client.init({
            zoomAppRoot: meetingSDKElement.current,
            language: 'en-US',
            patchJsMedia: true,
            customize: {
              video: {
                isResizable: true,
                viewSizes: {
                  default: {
                    width: 1000,
                    height: 600,
                  },
                  ribbon: {
                    width: 300,
                    height: 700,
                  },
                },
              },
              meetingInfo: [
                'topic',
                'host',
                'mn',
                'pwd',
                'telPwd',
                'invite',
                'participant',
                'dc',
                'enctype',
              ],
              toolbar: {
                buttons: [
                  {
                    text: 'Custom Button',
                    className: 'CustomButton',
                    onClick: () => {
                      console.log('custom button click');
                    },
                  },
                ],
              },
            },
          });

          // Get signature from API
          const response = await fetch('/api/zoom/generate-signature', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              meetingNumber,
              role: 0, // 0 = attendee, 1 = host
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to generate Zoom signature');
          }

          const { signature } = await response.json();

          // Join meeting
          await client.join({
            signature,
            sdkKey: process.env.NEXT_PUBLIC_ZOOM_SDK_KEY || '',
            meetingNumber,
            password: passWord,
            userName,
            userEmail,
            tk: '', // Registration token (empty for non-registered)
            zak: '', // Zoom access token (empty for non-registered)
          });

          setIsLoading(false);
        }
      } catch (err: any) {
        console.error('Zoom initialization error:', err);
        setError(err.message || 'Failed to initialize Zoom meeting');
        setIsLoading(false);
      }
    };

    initZoom();

    // Cleanup
    return () => {
      if (clientRef.current) {
        try {
          // @ts-ignore - leaveMeeting may not be in types
          clientRef.current.leaveMeeting?.();
        } catch (err) {
          console.error('Error leaving meeting:', err);
        }
      }
    };
  }, [meetingNumber, userName, userEmail, passWord]);

  if (error) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white p-8">
        <div className="max-w-md text-center space-y-4">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-[#1D2A38]">
            Unable to Join Meeting
          </h2>
          <p className="text-gray-600">{error}</p>
          {zoomJoinUrl && (
            <div className="pt-4">
              <a
                href={zoomJoinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-gradient-to-r from-[#CCA43B] to-[#B8932F] hover:from-[#B8932F] hover:to-[#CCA43B] text-[#1D2A38] font-bold rounded-xl border-2 border-[#CCA43B] transition-all"
              >
                Open in Zoom App
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-[#1D2A38]">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-white via-gray-50 to-white z-50">
          <Loader2 className="w-16 h-16 text-[#CCA43B] animate-spin mb-4" />
          <p className="text-xl font-semibold text-[#1D2A38]">
            Connecting to meeting...
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Please wait while we set things up
          </p>
        </div>
      )}
      <div
        ref={meetingSDKElement}
        className="w-full h-full"
        style={{ minHeight: '100vh' }}
      />
    </div>
  );
};

export default ZoomMeetingPlayer;

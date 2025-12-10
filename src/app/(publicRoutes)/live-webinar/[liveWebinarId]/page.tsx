import { onAuthenticateUser } from '@/actions/auth';
import { getWebinarById } from '@/actions/webinar';
import { checkAndUpdateExpiredWebinars } from '@/actions/webinarManagement';
import React from 'react';
import RenderWebinar from './_components/RenderWebinar';
import { prismaClient } from '@/lib/prismaClient';
import Link from 'next/link';

type Props = {
  params: Promise<{
    liveWebinarId: string;
  }>;
  searchParams: Promise<{
    error: string;
  }>;
};

const page = async ({ params, searchParams }: Props) => {
  const { liveWebinarId } = await params;
  const { error } = await searchParams;

  // Check and update any expired webinars before displaying
  await checkAndUpdateExpiredWebinars();

  const webinarData = await getWebinarById(liveWebinarId);
  if (!webinarData) {
    return (
        <div className="w-full min-h-screen flex justify-center items-center text-lg sm:text-4xl">
        Webinar not found
        </div>
    );
    }
    const checkUser = await onAuthenticateUser();

    if (!checkUser.user) {
      return (
        <div className="w-full min-h-screen flex flex-col justify-center items-center gap-4 text-center px-4">
          <p className="text-lg sm:text-2xl font-semibold">You need to be signed in to view this webinar.</p>
          <Link
            href="/sign-in"
            className="px-4 py-2 rounded-md bg-[#CCA43B] text-[#1D2A38] font-semibold border border-[#B8932F]"
          >
            Go to Sign In
          </Link>
        </div>
      );
    }

    const appUser = checkUser.user;

    const hasRegistration = await prismaClient.attendance.findFirst({
      where: {
        webinarId: liveWebinarId,
        OR: [
          {
            userId: appUser.id,
          },
          {
            user: {
              email: appUser.email,
            },
          },
        ],
      },
    });

    if (!hasRegistration) {
      return (
        <div className="w-full min-h-screen flex flex-col justify-center items-center gap-4 text-center px-4">
          <p className="text-lg sm:text-2xl font-semibold max-w-xl">
            You&apos;re not registered for this webinar yet. Please register from your dashboard to gain access.
          </p>
          <Link
            href="/home"
            className="px-4 py-2 rounded-md bg-[#CCA43B] text-[#1D2A38] font-semibold border border-[#B8932F]"
          >
            Return to Dashboard
          </Link>
        </div>
      );
    }

    // Todo: Create API keys
    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string;
    const token = process.env.STREAM_TOKEN as string;
    const callId = process.env.STREAM_CALL_ID as string;

    return (
    <div className="w-full min-h-screen mx-auto">
      <RenderWebinar
      error={error}
      user={checkUser.user||null}
      webinar={webinarData}
      apiKey={apiKey}
      token={token}
      callId={callId}
      />
      </div>
    );
};

export default page;
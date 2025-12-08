import { NextRequest, NextResponse } from 'next/server';
import { zoomClient } from '@/lib/zoom/client';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { topic, startTime, duration, timezone, agenda } = body;

    if (!topic || !startTime || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields: topic, startTime, duration' },
        { status: 400 }
      );
    }

    // Create Zoom webinar
    const zoomWebinar = await zoomClient.createWebinar({
      topic,
      type: 5, // Webinar
      start_time: new Date(startTime).toISOString(),
      duration: parseInt(duration),
      timezone: timezone || 'America/New_York',
      agenda: agenda || '',
      settings: {
        host_video: true,
        panelists_video: true,
        approval_type: 1, // Manual approval
        registration_type: 1, // Attendees register once
        audio: 'both',
        auto_recording: 'cloud',
      },
    });

    return NextResponse.json({
      success: true,
      webinar: {
        zoomId: zoomWebinar.id.toString(),
        zoomUuid: zoomWebinar.uuid,
        joinUrl: zoomWebinar.join_url,
        registrationUrl: zoomWebinar.registration_url,
      },
    });
  } catch (error: any) {
    console.error('Error creating Zoom webinar:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create Zoom webinar' },
      { status: 500 }
    );
  }
}

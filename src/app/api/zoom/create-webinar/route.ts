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
    const { topic, startTime, duration, timezone, agenda, useWebinar } = body;

    if (!topic || !startTime || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields: topic, startTime, duration' },
        { status: 400 }
      );
    }

    // Use Meetings by default (free/pro), or Webinars if explicitly requested (requires license)
    if (useWebinar) {
      // Create Zoom Webinar (requires paid Webinar add-on)
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
    } else {
      // Create Zoom Meeting (works with free/Pro accounts)
      const zoomMeeting = await zoomClient.createMeeting({
        topic,
        type: 2, // Scheduled meeting
        start_time: new Date(startTime).toISOString(),
        duration: parseInt(duration),
        timezone: timezone || 'America/New_York',
        agenda: agenda || '',
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: true, // Allow participants to join before host (no login required)
          mute_upon_entry: false,
          waiting_room: false, // Disable waiting room for instant access
          audio: 'both',
          auto_recording: 'cloud',
          approval_type: 0, // Automatically approve
        },
      });

      return NextResponse.json({
        success: true,
        webinar: {
          zoomId: zoomMeeting.id.toString(),
          zoomUuid: zoomMeeting.uuid,
          joinUrl: zoomMeeting.join_url,
          startUrl: zoomMeeting.start_url, // Host start URL
        },
      });
    }
  } catch (error: any) {
    console.error('Error creating Zoom meeting/webinar:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create Zoom meeting/webinar' },
      { status: 500 }
    );
  }
}

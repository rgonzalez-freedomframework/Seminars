import { NextRequest, NextResponse } from 'next/server';
import { zoomClient } from '@/lib/zoom/client';
import { auth } from '@clerk/nextjs/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ webinarId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { webinarId } = await params;

    if (!webinarId) {
      return NextResponse.json(
        { error: 'Webinar ID is required' },
        { status: 400 }
      );
    }

    // Delete Zoom webinar
    await zoomClient.deleteWebinar(webinarId);

    return NextResponse.json({
      success: true,
      message: 'Zoom webinar deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting Zoom webinar:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete Zoom webinar' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ webinarId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { webinarId } = await params;

    if (!webinarId) {
      return NextResponse.json(
        { error: 'Webinar ID is required' },
        { status: 400 }
      );
    }

    // Get Zoom webinar details
    const webinar = await zoomClient.getWebinar(webinarId);

    return NextResponse.json({
      success: true,
      webinar,
    });
  } catch (error: any) {
    console.error('Error fetching Zoom webinar:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch Zoom webinar' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ webinarId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { webinarId } = await params;

    if (!webinarId) {
      return NextResponse.json(
        { error: 'Webinar ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Update underlying Zoom MEETING (this app creates meetings, not licensed webinars)
    await zoomClient.updateMeeting(webinarId, body);

    return NextResponse.json({
      success: true,
      message: 'Zoom webinar updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating Zoom webinar:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update Zoom webinar' },
      { status: 500 }
    );
  }
}

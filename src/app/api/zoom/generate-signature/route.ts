import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { meetingNumber, role } = body;

    if (!meetingNumber) {
      return NextResponse.json(
        { error: 'Meeting number is required' },
        { status: 400 }
      );
    }

    const sdkKey = process.env.ZOOM_SDK_KEY;
    const sdkSecret = process.env.ZOOM_SDK_SECRET;

    if (!sdkKey || !sdkSecret) {
      return NextResponse.json(
        { error: 'Zoom SDK credentials not configured' },
        { status: 500 }
      );
    }

    // Generate signature for Zoom Meeting SDK
    const timestamp = new Date().getTime() - 30000;
    const msg = Buffer.from(sdkKey + meetingNumber + timestamp + role).toString('base64');
    const hash = crypto.createHmac('sha256', sdkSecret).update(msg).digest('base64');
    const signature = Buffer.from(`${sdkKey}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64');

    return NextResponse.json({
      signature,
    });
  } catch (error: any) {
    console.error('Error generating Zoom signature:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate signature' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/lib/prismaClient';
import crypto from 'crypto';

/**
 * Zoom Webhook Endpoint
 * Receives updates from Zoom about webinar changes
 * https://developers.zoom.us/docs/api/rest/webhook-reference/
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verify webhook signature if secret token is configured
    const webhookSecret = process.env.ZOOM_WEBHOOK_SECRET_TOKEN;
    if (webhookSecret) {
      const signature = request.headers.get('x-zm-signature');
      const timestamp = request.headers.get('x-zm-request-timestamp');
      
      if (!signature || !timestamp) {
        return NextResponse.json(
          { error: 'Missing webhook signature' },
          { status: 401 }
        );
      }

      // Verify signature
      const message = `v0:${timestamp}:${JSON.stringify(body)}`;
      const hash = crypto
        .createHmac('sha256', webhookSecret)
        .update(message)
        .digest('hex');
      const expectedSignature = `v0=${hash}`;

      if (signature !== expectedSignature) {
        return NextResponse.json(
          { error: 'Invalid webhook signature' },
          { status: 401 }
        );
      }
    }

    const { event, payload } = body;

    console.log('Received Zoom webhook:', event);

    // Handle different webhook events
    switch (event) {
      case 'webinar.updated':
        await handleWebinarUpdated(payload);
        break;

      case 'webinar.deleted':
        await handleWebinarDeleted(payload);
        break;

      case 'webinar.started':
        await handleWebinarStarted(payload);
        break;

      case 'webinar.ended':
        await handleWebinarEnded(payload);
        break;

      default:
        console.log('Unhandled webhook event:', event);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error processing Zoom webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

async function handleWebinarUpdated(payload: any) {
  const { object } = payload;
  const zoomWebinarId = object.id.toString();

  // Find webinar in our database
  const webinar = await prismaClient.webinar.findFirst({
    where: { zoomWebinarId },
  });

  if (!webinar) {
    console.log('Webinar not found in database:', zoomWebinarId);
    return;
  }

  // Update webinar with new data from Zoom
  const updateData: any = {};

  if (object.topic) updateData.title = object.topic;
  if (object.agenda) updateData.description = object.agenda;
  if (object.start_time) updateData.startTime = new Date(object.start_time);
  if (object.duration) updateData.duration = object.duration;

  await prismaClient.webinar.update({
    where: { id: webinar.id },
    data: updateData,
  });

  console.log('Webinar updated from Zoom:', webinar.id);
}

async function handleWebinarDeleted(payload: any) {
  const { object } = payload;
  const zoomWebinarId = object.id.toString();

  // Find and mark as cancelled (don't delete from our database)
  const webinar = await prismaClient.webinar.findFirst({
    where: { zoomWebinarId },
  });

  if (!webinar) {
    console.log('Webinar not found in database:', zoomWebinarId);
    return;
  }

  await prismaClient.webinar.update({
    where: { id: webinar.id },
    data: { webinarStatus: 'CANCELLED' },
  });

  console.log('Webinar marked as cancelled from Zoom:', webinar.id);
}

async function handleWebinarStarted(payload: any) {
  const { object } = payload;
  const zoomWebinarId = object.id.toString();

  const webinar = await prismaClient.webinar.findFirst({
    where: { zoomWebinarId },
  });

  if (!webinar) {
    console.log('Webinar not found in database:', zoomWebinarId);
    return;
  }

  await prismaClient.webinar.update({
    where: { id: webinar.id },
    data: { webinarStatus: 'LIVE' },
  });

  console.log('Webinar marked as LIVE from Zoom:', webinar.id);
}

async function handleWebinarEnded(payload: any) {
  const { object } = payload;
  const zoomWebinarId = object.id.toString();

  const webinar = await prismaClient.webinar.findFirst({
    where: { zoomWebinarId },
  });

  if (!webinar) {
    console.log('Webinar not found in database:', zoomWebinarId);
    return;
  }

  await prismaClient.webinar.update({
    where: { id: webinar.id },
    data: { webinarStatus: 'ENDED' },
  });

  console.log('Webinar marked as ENDED from Zoom:', webinar.id);
}

// Endpoint validation for Zoom webhook setup
export async function GET(request: NextRequest) {
  // Zoom sends a challenge parameter to verify the endpoint
  const searchParams = request.nextUrl.searchParams;
  const challenge = searchParams.get('challenge');

  if (challenge) {
    return new NextResponse(challenge, {
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  return NextResponse.json({ message: 'Zoom webhook endpoint is active' });
}

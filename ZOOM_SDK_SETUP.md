# Zoom Meeting SDK Setup Guide

This guide explains how to set up the Zoom Meeting SDK to embed meetings directly in your webinar pages, allowing attendees to join without logging into Zoom.

## Overview

The Zoom Meeting SDK is **different** from the Server-to-Server OAuth app:
- **Server-to-Server OAuth**: Used to create/manage meetings via API (already configured)
- **Meeting SDK**: Used to embed meetings in your website for attendees to join

You need **both** to get the full integration working.

## Prerequisites

- Zoom account (Free, Pro, Business, or Enterprise)
- Admin access to Zoom Marketplace

## Step 1: Create a Meeting SDK App

1. Go to [Zoom Marketplace](https://marketplace.zoom.us/)
2. Click **"Develop"** → **"Build App"**
3. Choose **"Meeting SDK"**
4. Fill in the app information:
   - **App Name**: `Seminars Meeting SDK` (or your app name)
   - **Short Description**: `Embed Zoom meetings in webinar platform`
   - **Company Name**: Your company name
   - **Developer Contact**: Your email
5. Click **"Create"**

## Step 2: Get SDK Credentials

After creating the app:

1. Go to the **"App Credentials"** tab
2. You'll see:
   - **SDK Key** (also called Client ID)
   - **SDK Secret** (also called Client Secret)
3. Copy both values - you'll need them for environment variables

## Step 3: Configure App Settings

### App Features
- Enable **"Meeting SDK"**
- You can optionally enable **"Video SDK"** if you want more customization

### Scopes
The Meeting SDK doesn't require additional scopes like the OAuth app. It uses the SDK Key/Secret for authentication.

### Activation
1. Go to the **"Activation"** tab
2. Add the following information:
   - **Company Name**: Your company
   - **Feature Description**: Describe how you'll use the SDK (e.g., "Allow attendees to join webinars directly in browser")
   - **App Distribution**: Choose **"Private"** (only you will use it)
3. Click **"Activate"**

## Step 4: Set Environment Variables

Add these variables to your `.env.local` file for local development:

```bash
# Zoom Meeting SDK Credentials (for embedding meetings)
ZOOM_SDK_KEY=your_sdk_key_here
ZOOM_SDK_SECRET=your_sdk_secret_here
NEXT_PUBLIC_ZOOM_SDK_KEY=your_sdk_key_here  # Same as ZOOM_SDK_KEY, but public
```

**Note**: The SDK Key needs to be available on the client-side, so we use `NEXT_PUBLIC_ZOOM_SDK_KEY`.

### For Vercel Production Deployment

Add the same variables in Vercel:

1. Go to your project in Vercel
2. Settings → Environment Variables
3. Add:
   - `ZOOM_SDK_KEY` → your SDK key
   - `ZOOM_SDK_SECRET` → your SDK secret
   - `NEXT_PUBLIC_ZOOM_SDK_KEY` → your SDK key (same value)
4. Redeploy your application

## Step 5: Verify Integration

After setting up the environment variables:

1. **Create a test webinar** in your admin portal with Zoom integration enabled
2. **Set the webinar to LIVE** status
3. **Visit the webinar page** as an attendee (not logged in as presenter)
4. You should see the Zoom meeting embedded directly in the page with:
   - Full video/audio controls
   - Chat functionality
   - Participant list
   - Screen sharing view

## How It Works

### Architecture

1. **Admin creates webinar** → Server-to-Server OAuth creates Zoom meeting via API
2. **Meeting ID and join URL saved** → Stored in database (`zoomWebinarId`, `zoomJoinUrl`)
3. **Attendee visits live webinar** → `ZoomMeetingPlayer` component renders
4. **SDK signature generated** → Server-side API route (`/api/zoom/generate-signature`) creates JWT
5. **Meeting embedded** → Zoom SDK loads meeting in browser iframe
6. **Attendee joins** → No Zoom login required (uses meeting ID + signature)

### Code Flow

```
RenderWebinar.tsx (checks if LIVE and has zoomJoinUrl)
   ↓
ZoomMeetingPlayer.tsx (initializes Zoom SDK)
   ↓
/api/zoom/generate-signature (generates JWT signature)
   ↓
client.join() (joins meeting with attendee role)
   ↓
Meeting embedded in page (full video/audio/chat)
```

## Security Notes

### Why Server-Side Signature?

The signature generation happens server-side (`/api/zoom/generate-signature`) to keep your SDK Secret secure. **Never expose the SDK Secret in client-side code.**

The signature is a JWT token that proves:
- The request is coming from your authorized app (SDK Key)
- The meeting number is valid
- The user has permission to join (role: 0 = attendee, 1 = host)
- The request is time-limited (expires after short period)

### Meeting Security Settings

When creating meetings via the API, we configure:
- `join_before_host: true` - Attendees can join without host present
- `waiting_room: false` - No approval needed
- `approval_type: 0` - Auto-approve participants

This allows seamless joining without Zoom login, but you can adjust these settings in `src/lib/zoom/client.ts` if you need more security.

## Troubleshooting

### "Missing SDK credentials" Error

**Problem**: Environment variables not set
**Solution**: Add `ZOOM_SDK_KEY`, `ZOOM_SDK_SECRET`, and `NEXT_PUBLIC_ZOOM_SDK_KEY` to your environment

### Meeting Loads But Can't Join

**Problem**: Signature generation failing or invalid credentials
**Solution**: 
1. Check that SDK Key/Secret match your Meeting SDK app (not OAuth app)
2. Verify signature generation logic in `/api/zoom/generate-signature/route.ts`
3. Check browser console for specific error messages

### "Invalid Meeting Number" Error

**Problem**: Meeting ID not parsed correctly
**Solution**: Verify that `zoomWebinarId` contains the numeric meeting ID (e.g., "1234567890")

### Blank Screen or Loading Forever

**Problem**: SDK assets not loading or JavaScript error
**Solution**:
1. Check browser console for errors
2. Verify `@zoom/meetingsdk` package is installed: `npm list @zoom/meetingsdk`
3. Check network tab for failed requests

### Meeting Works Locally But Not in Production

**Problem**: Environment variables not set in Vercel
**Solution**: Add all three SDK variables to Vercel project settings and redeploy

## Switching Zoom Accounts

If you need to switch to a different Zoom account:

1. Create a new Meeting SDK app in the new Zoom account
2. Get the new SDK Key and SDK Secret
3. Update environment variables:
   - Locally: Update `.env.local`
   - Production: Update in Vercel settings and redeploy
4. You'll also need to update the Server-to-Server OAuth credentials (see `ZOOM_INTEGRATION_SETUP.md`)

Both apps (OAuth and SDK) should be created in the **same Zoom account** for consistency.

## Resources

- [Zoom Meeting SDK Documentation](https://developers.zoom.us/docs/meeting-sdk/)
- [Meeting SDK JavaScript](https://developers.zoom.us/docs/meeting-sdk/web/)
- [SDK Authentication](https://developers.zoom.us/docs/meeting-sdk/auth/)
- [Marketplace](https://marketplace.zoom.us/)

## Support

If you encounter issues:
1. Check Zoom's [Developer Forum](https://devforum.zoom.us/)
2. Review the [Meeting SDK Release Notes](https://developers.zoom.us/docs/meeting-sdk/web/release-notes/)
3. Verify your Zoom account tier supports the features you're using

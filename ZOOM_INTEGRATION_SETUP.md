# Zoom Integration Setup Guide

This guide will help you integrate Zoom with your Freedom Framework webinar platform.

## Prerequisites

1. A Zoom account (Pro plan or higher required for webinars)
2. Access to Zoom Marketplace (https://marketplace.zoom.us/)
3. Your production domain

## Step 1: Create Zoom Server-to-Server OAuth App

1. Go to https://marketplace.zoom.us/
2. Click **Develop** → **Build App**
3. Select **Server-to-Server OAuth** app type
4. Click **Create**

### App Information
- **App Name**: Freedom Framework Webinars
- **Short Description**: Webinar management integration
- **Company Name**: Freedom Framework
- **Developer Contact**: Your email

### App Credentials
After creating the app, you'll see three important credentials:
- **Account ID** - Save this
- **Client ID** - Save this
- **Client Secret** - Save this (copy it immediately, you won't see it again)

### Scopes
Add the following scopes to your app:

**Required Scopes (for Meetings - FREE/Pro):**
- `meeting:write:admin` - Create meetings
- `meeting:read:admin` - Read meeting details  
- `user:read:admin` - Read user information

**Optional Scopes (for Webinars - Paid license required):**
- `webinar:write:admin` - Create webinars (only if you have Webinar license)
- `webinar:read:admin` - Read webinar details (only if you have Webinar license)

### Activation
1. Click **Continue**
2. Review the information
3. Click **Activate your app**

## Step 2: Update Environment Variables

Add these environment variables to your `.env.local` file (development) and Vercel (production):

```bash
# Zoom Integration
ZOOM_CLIENT_ID=your_client_id_here
ZOOM_CLIENT_SECRET=your_client_secret_here
ZOOM_ACCOUNT_ID=your_account_id_here
```

### For Local Development:
1. Create or update `/workspaces/Seminars/.env.local`
2. Add the three Zoom variables above
3. Restart your development server

### For Production (Vercel):
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add all three Zoom variables
5. Redeploy your application

## Step 3: Run Database Migration

After setting up environment variables, run the migration:

```bash
cd /workspaces/Seminars
npx prisma migrate dev --name add_zoom_integration
```

This adds the following fields to the `Webinar` table:
- `zoomWebinarId` - Stores the Zoom webinar ID
- `zoomJoinUrl` - Direct join link for the webinar
- `zoomRegistrationUrl` - Registration page URL

For production deployment:
```bash
npx prisma migrate deploy
```

## Step 4: Using Zoom Integration

### Creating a Webinar with Zoom

1. Go to **Admin Dashboard** → **Create Webinar**
2. Fill in basic information (name, description, date, time, **duration**)
3. In the **Additional Info** step, toggle **"Zoom Integration"** ON
4. Complete the form and submit

### What Happens Automatically

When Zoom integration is enabled:
- ✅ A Zoom **Meeting** is created by default (works with Free/Pro accounts)
- ✅ Join URL is saved to the database  
- ✅ Participants can join without logging in (join_before_host enabled)
- ✅ No waiting room - instant access
- ✅ Cloud recording enabled automatically

**Note:** The system uses Zoom Meetings by default. Meetings allow everyone to participate freely (like a video call). If you upgrade to a Webinar license later, you can switch to Webinars where only hosts/panelists can talk.

### Accessing Zoom Webinar Details

The system stores three pieces of Zoom data:
```typescript
{
  zoomWebinarId: "123456789", // Zoom's ID
  zoomJoinUrl: "https://zoom.us/j/123456789",
  zoomRegistrationUrl: "https://zoom.us/webinar/register/..."
}
```

You can display these in your webinar details or send them to attendees.

## Step 5: Testing

### Test Locally
1. Make sure environment variables are set
2. Start dev server: `npm run dev`
3. Create a test webinar with Zoom enabled
4. Check Zoom dashboard to verify webinar was created

### Test in Production
1. Deploy to Vercel with environment variables set
2. Create a webinar through the admin portal
3. Verify in Zoom dashboard that the webinar appears
4. Test the join URL

## API Endpoints

The integration includes these API routes:

### Create Zoom Webinar
```
POST /api/zoom/create-webinar
```

**Request Body:**
```json
{
  "topic": "Webinar Title",
  "startTime": "2025-12-15T14:00:00Z",
  "duration": 60,
  "timezone": "America/New_York",
  "agenda": "Description here"
}
```

**Response:**
```json
{
  "success": true,
  "webinar": {
    "zoomId": "123456789",
    "zoomUuid": "abc123",
    "joinUrl": "https://zoom.us/j/123456789",
    "registrationUrl": "https://zoom.us/webinar/register/..."
  }
}
```

### Get Webinar Details
```
GET /api/zoom/webinar/[webinarId]
```

### Delete Zoom Webinar
```
DELETE /api/zoom/webinar/[webinarId]
```

## Switching Zoom Accounts

To use a different Zoom account (or switch accounts later):

### 1. Create New Server-to-Server OAuth App
- Follow Step 1 again with the new Zoom account
- Get new Account ID, Client ID, and Client Secret

### 2. Update Environment Variables

**In Vercel (Production):**
1. Go to https://vercel.com/dashboard
2. Select your project → Settings → Environment Variables
3. Find and **Edit** these three variables:
   - `ZOOM_CLIENT_ID`
   - `ZOOM_CLIENT_SECRET`
   - `ZOOM_ACCOUNT_ID`
4. Replace with new credentials
5. Click **Save**
6. **Redeploy** your application (Deployments → Redeploy)

**Locally:**
1. Edit `.env.local` file
2. Update the three Zoom variables
3. Restart your development server

### 3. That's It!
- No code changes required
- Old meetings will still have their links (they're stored in database)
- New meetings will be created under the new account
- Takes effect immediately after redeployment

### Multiple Accounts
You can only use one Zoom account at a time. To manage multiple accounts:
- Use different environment variables per deployment (Production vs Preview)
- Or switch credentials when needed via Vercel settings

## Troubleshooting

### "Failed to authenticate with Zoom"
- Verify all three environment variables are set correctly
- Check that your Zoom app is activated
- Ensure Account ID matches your Zoom account

### "Failed to create Zoom webinar"
- Verify you have a Zoom Pro account or higher
- Check that all required scopes are added to your app
- Ensure the start time is in the future
- Verify duration is between 15-480 minutes

### Webinar created in database but not in Zoom
- Check server logs for Zoom API errors
- Verify `NEXT_PUBLIC_BASE_URL` is set correctly
- Ensure Clerk authentication is working

### "Environment variable not found: ZOOM_CLIENT_ID"
- Restart your development server after adding environment variables
- For Vercel, redeploy after adding variables
- Check that variable names match exactly (case-sensitive)

## Security Best Practices

1. **Never commit** `.env.local` or environment variables to Git
2. **Rotate credentials** if they're ever exposed
3. Use **Server-to-Server OAuth** (not user-level OAuth) for security
4. Store Zoom credentials only in **server-side** environment variables
5. Validate all API requests with Clerk authentication

## Features

✅ Automatic Zoom webinar creation  
✅ Sync webinar details with database  
✅ Generate join and registration URLs  
✅ Support for manual approval registration  
✅ Cloud recording enabled by default  
✅ Error handling and fallback (creates webinar even if Zoom fails)

## Future Enhancements

Potential features to add:
- Webhook integration for attendance tracking
- Automatic recording download after webinar
- Panelist management
- Q&A and polling integration
- Breakout room configuration
- Co-host management

## Support

For Zoom-specific issues:
- Zoom API Documentation: https://developers.zoom.us/docs/api/
- Zoom Developer Forum: https://devforum.zoom.us/

For application issues:
- Check application logs in Vercel
- Review Prisma database logs
- Test API endpoints with Postman or curl

# Zoom Webhook Configuration Guide

## Overview
The app now has bidirectional sync with Zoom - changes made in either system are automatically reflected in the other.

## Setting Up Zoom Webhooks

### 1. Access Zoom Marketplace
1. Go to [Zoom Marketplace](https://marketplace.zoom.us/)
2. Sign in with your Zoom account
3. Click on **Develop** → **Build App**

### 2. Configure Webhook
1. Select your existing Server-to-Server OAuth app (or the app you're using for webinars)
2. Go to **Feature** tab
3. Click on **Event Subscriptions**
4. Toggle **Enable Event Subscriptions** to ON

### 3. Add Webhook URL
**Webhook Endpoint URL:**
```
https://your-domain.vercel.app/api/zoom/webhook
```

Replace `your-domain.vercel.app` with your actual Vercel deployment URL.

### 4. Validate Endpoint
- Zoom will send a validation request with a `challenge` parameter
- Our endpoint automatically handles this and returns the challenge
- Click **Validate** to complete the setup

### 5. Subscribe to Events
Select the following events to receive notifications:

**Webinar Events:**
- ✅ `webinar.updated` - When webinar details are changed in Zoom
- ✅ `webinar.deleted` - When a webinar is deleted in Zoom
- ✅ `webinar.started` - When a webinar goes live in Zoom
- ✅ `webinar.ended` - When a webinar ends in Zoom

### 6. Add Webhook Secret (Optional but Recommended)
1. In the Event Subscriptions section, you'll see a **Secret Token**
2. Copy this token
3. Add it to your environment variables:

```env
ZOOM_WEBHOOK_SECRET_TOKEN=your_secret_token_here
```

This enables signature verification for security.

### 7. Save Configuration
Click **Save** to activate the webhooks.

## How It Works

### From App to Zoom
When admin edits a webinar in the app:
- Updates are sent to Zoom API
- Webinar details in Zoom are updated automatically
- Delete/cancel actions also affect Zoom

### From Zoom to App
When changes are made in Zoom dashboard:
- Zoom sends webhook event to `/api/zoom/webhook`
- App automatically updates the database
- Status changes (LIVE, ENDED) are reflected immediately
- Time/duration changes are synced

## Supported Sync Operations

| Action | App → Zoom | Zoom → App |
|--------|-----------|-----------|
| Edit Title | ✅ | ✅ |
| Edit Description | ✅ | ✅ |
| Change Time | ✅ | ✅ |
| Change Duration | ✅ | ✅ |
| Delete Webinar | ✅ | ✅ (marked as cancelled) |
| Start Webinar | ✅ | ✅ |
| End Webinar | ✅ | ✅ |

## Testing the Webhook

### Test Locally (Development)
1. Use [ngrok](https://ngrok.com/) or similar tool to expose your local server:
   ```bash
   ngrok http 3000
   ```
2. Use the ngrok URL in Zoom webhook configuration:
   ```
   https://your-ngrok-url.ngrok.io/api/zoom/webhook
   ```

### Test in Production
1. Make a change to a webinar in Zoom dashboard
2. Check your Vercel logs to see the webhook was received
3. Verify the change is reflected in your app's database

## Troubleshooting

### Webhook Not Receiving Events
- Verify the webhook URL is correct and accessible
- Check Zoom app has the webinar scope enabled
- Ensure Event Subscriptions are enabled
- Check Vercel logs for any errors

### Signature Verification Failing
- Ensure `ZOOM_WEBHOOK_SECRET_TOKEN` is correctly set
- Token should match exactly what's shown in Zoom Marketplace

### Updates Not Syncing
- Check that webhook events are subscribed correctly
- Verify the webinar has `zoomWebinarId` in the database
- Check application logs for API errors

## Security Notes

1. **Always use HTTPS** - Zoom webhooks require HTTPS endpoints
2. **Implement signature verification** - Use the secret token to verify webhook authenticity
3. **Rate limiting** - Consider adding rate limiting to the webhook endpoint
4. **Error handling** - Webhook failures should not break the app

## Environment Variables Required

```env
# Zoom OAuth Credentials
ZOOM_CLIENT_ID=your_client_id
ZOOM_CLIENT_SECRET=your_client_secret  
ZOOM_ACCOUNT_ID=your_account_id

# Webhook Security (Optional but Recommended)
ZOOM_WEBHOOK_SECRET_TOKEN=your_webhook_secret

# App Base URL
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

## Additional Resources

- [Zoom Webhook Documentation](https://developers.zoom.us/docs/api/rest/webhook-reference/)
- [Event Notification Types](https://developers.zoom.us/docs/api/rest/webhook-reference/webinar-events/)
- [Webhook Security](https://developers.zoom.us/docs/api/rest/webhook-reference/#validate-your-webhook-endpoint)

/* Quick Zoom API test using current env vars.
 * This will try to get an access token via Server-to-Server OAuth
 * and create a short test meeting for user "me".
 */

const axios = require('axios');

async function main() {
  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;
  const accountId = process.env.ZOOM_ACCOUNT_ID;

  if (!clientId || !clientSecret || !accountId) {
    console.error('Missing Zoom env vars');
    process.exit(1);
  }

  try {
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    console.log('Requesting Zoom access token...');
    const tokenRes = await axios.post(
      `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`,
      {},
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    const accessToken = tokenRes.data.access_token;
    console.log('Access token OK, scopes:', tokenRes.data.scope);

    console.log('Creating test meeting...');
    const meetingRes = await axios.post(
      'https://api.zoom.us/v2/users/me/meetings',
      {
        topic: 'Freedom Framework Test Meeting',
        type: 2,
        start_time: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        duration: 30,
        timezone: 'America/New_York',
        agenda: 'Test meeting created from dev container',
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: true,
          waiting_room: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('Created meeting:', {
      id: meetingRes.data.id,
      join_url: meetingRes.data.join_url,
      start_time: meetingRes.data.start_time,
    });
  } catch (err) {
    if (err.response) {
      console.error('Zoom API error:', err.response.status, err.response.data);
    } else {
      console.error('Error:', err.message);
    }
    process.exit(1);
  }
}

main();

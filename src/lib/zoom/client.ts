import axios from 'axios';

const ZOOM_API_BASE_URL = 'https://api.zoom.us/v2';

interface ZoomTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface ZoomWebinarRequest {
  topic: string;
  type: 5; // Webinar
  start_time: string; // ISO 8601 format
  duration: number; // in minutes
  timezone: string;
  agenda?: string;
  settings?: {
    host_video?: boolean;
    panelists_video?: boolean;
    approval_type?: 0 | 1 | 2; // 0=auto, 1=manual, 2=no registration
    registration_type?: 1 | 2 | 3;
    audio?: 'both' | 'telephony' | 'voip';
    auto_recording?: 'local' | 'cloud' | 'none';
  };
}

interface ZoomWebinarResponse {
  id: number;
  uuid: string;
  host_id: string;
  topic: string;
  type: number;
  start_time: string;
  duration: number;
  timezone: string;
  created_at: string;
  join_url: string;
  registration_url?: string;
}

class ZoomClient {
  private clientId: string;
  private clientSecret: string;
  private accountId: string;
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor() {
    this.clientId = process.env.ZOOM_CLIENT_ID || '';
    this.clientSecret = process.env.ZOOM_CLIENT_SECRET || '';
    this.accountId = process.env.ZOOM_ACCOUNT_ID || '';

    if (!this.clientId || !this.clientSecret || !this.accountId) {
      throw new Error('Zoom credentials are not configured. Please set ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET, and ZOOM_ACCOUNT_ID in your environment variables.');
    }
  }

  /**
   * Get OAuth access token using Server-to-Server OAuth
   */
  private async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    try {
      const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      
      const response = await axios.post<ZoomTokenResponse>(
        `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${this.accountId}`,
        {},
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.accessToken = response.data.access_token;
      // Set expiration 5 minutes before actual expiry for safety
      this.tokenExpiresAt = Date.now() + (response.data.expires_in - 300) * 1000;

      return this.accessToken;
    } catch (error) {
      console.error('Failed to get Zoom access token:', error);
      throw new Error('Failed to authenticate with Zoom');
    }
  }

  /**
   * Create a Zoom webinar
   */
  async createWebinar(data: ZoomWebinarRequest): Promise<ZoomWebinarResponse> {
    const token = await this.getAccessToken();

    try {
      const response = await axios.post<ZoomWebinarResponse>(
        `${ZOOM_API_BASE_URL}/users/me/webinars`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Failed to create Zoom webinar:', error.response?.data || error.message);
      throw new Error(`Failed to create Zoom webinar: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get webinar details
   */
  async getWebinar(webinarId: string): Promise<ZoomWebinarResponse> {
    const token = await this.getAccessToken();

    try {
      const response = await axios.get<ZoomWebinarResponse>(
        `${ZOOM_API_BASE_URL}/webinars/${webinarId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Failed to get Zoom webinar:', error.response?.data || error.message);
      throw new Error(`Failed to get Zoom webinar: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Delete a Zoom webinar
   */
  async deleteWebinar(webinarId: string): Promise<void> {
    const token = await this.getAccessToken();

    try {
      await axios.delete(
        `${ZOOM_API_BASE_URL}/webinars/${webinarId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
    } catch (error: any) {
      console.error('Failed to delete Zoom webinar:', error.response?.data || error.message);
      throw new Error(`Failed to delete Zoom webinar: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Update a Zoom webinar
   */
  async updateWebinar(webinarId: string, data: Partial<ZoomWebinarRequest>): Promise<void> {
    const token = await this.getAccessToken();

    try {
      await axios.patch(
        `${ZOOM_API_BASE_URL}/webinars/${webinarId}`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error: any) {
      console.error('Failed to update Zoom webinar:', error.response?.data || error.message);
      throw new Error(`Failed to update Zoom webinar: ${error.response?.data?.message || error.message}`);
    }
  }
}

// Export singleton instance
export const zoomClient = new ZoomClient();
export type { ZoomWebinarRequest, ZoomWebinarResponse };

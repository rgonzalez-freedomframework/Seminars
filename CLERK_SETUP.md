# Clerk Authentication Setup Guide

## Admin User Setup

### Step 1: Create Admin User in Clerk Dashboard

1. Go to your Clerk Dashboard: https://dashboard.clerk.com
2. Navigate to your application
3. Go to "Users" section
4. Click "Create User"
5. Enter the following credentials:
   - **Email**: `rgonzalez@freedomframework.us`
   - **Password**: `Googledocs8970!`
   - Set as Admin/Organization Admin if needed

### Step 2: Enable Google OAuth

1. In Clerk Dashboard, go to "Social Connections"
2. Enable "Google" as a social provider
3. Follow Clerk's guide to set up Google OAuth credentials:
   - Create a Google Cloud project
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs from Clerk
4. Save your Google Client ID and Secret in Clerk

### Step 3: Configure Authentication Settings

In your Clerk Dashboard > User & Authentication > Email, Phone, Username:

1. **Enable Email + Password authentication**
2. **Enable Google OAuth**
3. **Require email verification** (optional but recommended)
4. **Enable password requirements**:
   - Minimum 8 characters
   - Require uppercase letter
   - Require number
   - Require special character

### Step 4: Update Environment Variables

Ensure your `.env.local` has:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YnVyc3Rpbmctc3RvcmstNTQuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_FzlM4aDJFrdZLG7HV5xRyljY44FKx9d6dyCP1fAgG8
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/home
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/home
```

## User Registration Flow

### For Users (Non-Admin):

1. **Visit Landing Page** (`/`)
2. **Click "Get Started - Register Free"** button
3. **Choose Registration Method**:
   - **Google Sign-In**: Auto-fills name and email from Google account
   - **Email/Password**: Manual registration with required fields:
     - Full Name
     - Email Address
     - Password (with strength requirements)
     - Phone (optional)
     - Business Name (optional)
4. **After Registration**: Automatically redirected to `/home` dashboard
5. **Future Logins**: Use `/sign-in` or click "Login / Register" from main page

### For Admin:

1. Visit `/sign-in`
2. Login with:
   - Email: `rgonzalez@freedomframework.us`
   - Password: `Googledocs8970!`
3. Access admin functions at `/admin/*` routes

## Additional Clerk Features Available

### User Metadata
Store additional user information in Clerk:
- Phone number
- Business name  
- Preferences
- Subscription status

### Webhooks
Set up webhooks in Clerk Dashboard to:
- Sync user data to your database
- Send welcome emails
- Track user events

### Organizations (Optional)
Enable if you want to support:
- Team accounts
- Multiple users per law firm
- Role-based access control

## Testing

1. **Test Google OAuth**:
   - Click "Get Started"
   - Choose "Continue with Google"
   - Verify auto-fill of name/email
   - Check redirect to `/home`

2. **Test Email/Password**:
   - Click "Get Started"  
   - Enter email and create password
   - Verify password requirements
   - Check account creation and redirect

3. **Test Admin Login**:
   - Go to `/sign-in`
   - Use admin credentials
   - Verify access to `/admin/*` routes

## Support

For issues with Clerk setup:
- Documentation: https://clerk.com/docs
- Support: https://clerk.com/support

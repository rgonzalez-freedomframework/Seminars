# Vercel Deployment Guide for Spotlight

## Prerequisites Checklist

Before deploying to Vercel, ensure you have:

- ✅ Vercel account (free tier works)
- ✅ GitHub repository connected to Vercel
- ✅ All environment variables ready
- ✅ Database accessible from Vercel (Neon DB is already configured)

---

## Step 1: Prepare Environment Variables

You need to set these in Vercel Dashboard → Settings → Environment Variables:

### Required Variables:

```bash
# Database (Already configured)
DATABASE_URL=postgresql://neondb_owner:npg_LIMWSn7ezK2r@ep-fancy-water-afb9gu6q-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require

# Clerk (Already configured)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YnVyc3Rpbmctc3RvcmstNTQuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_FzlM4aDJFrdZLG7HV5xRyljY44FKx9d6dyCP1fAgG8

# Stream Video SDK - GET FROM: https://getstream.io/dashboard/
NEXT_PUBLIC_STREAM_API_KEY=your_key_here
STREAM_TOKEN=your_token_here
STREAM_CALL_ID=your_call_id_here
NEXT_PUBLIC_STREAM_USER_ID=your_user_id_here

# Stripe - GET FROM: https://dashboard.stripe.com/apikeys
NEXT_PUBLIC_STRIPE_CLIENT_ID=your_client_id_here
STRIPE_SECRET_KEY=your_secret_key_here

# Base URL (Update after deployment)
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
```

---

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow prompts and set environment variables when asked

### Option B: Using Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `prisma generate && next build` (auto-detected from package.json)
   - **Install Command**: `npm install` (auto-detected)

4. Add all environment variables listed above
5. Click "Deploy"

---

## Step 3: Post-Deployment Configuration

### Update Clerk Redirect URLs

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Navigate to: **Paths** → **Redirects**
3. Add your Vercel URLs:
   - Sign-in fallback: `https://your-app.vercel.app/sign-in`
   - Sign-up fallback: `https://your-app.vercel.app/sign-up`
   - Home URL: `https://your-app.vercel.app/home`

### Update Stripe Redirect URLs

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/settings/connect)
2. Add redirect URL: `https://your-app.vercel.app/api/stripe/callback`

### Update Base URL Environment Variable

1. In Vercel Dashboard → Settings → Environment Variables
2. Update `NEXT_PUBLIC_BASE_URL` to your actual Vercel URL
3. Redeploy: Vercel → Deployments → Click "..." → Redeploy

---

## Step 4: Database Migrations

Vercel will automatically run migrations during build via the build command:
```bash
prisma generate && next build
```

If you need to manually run migrations:
```bash
npx prisma migrate deploy
```

---

## Missing Services Setup

⚠️ **IMPORTANT**: You still need to set up these services:

### 1. Stream.io (Video SDK)
- Sign up at: https://getstream.io/
- Create a new app
- Get API Key, Token, Call ID, and User ID
- Add to Vercel environment variables

### 2. Stripe Connect
- Go to: https://dashboard.stripe.com/settings/connect
- Enable Connect
- Get Client ID and Secret Key
- Add to Vercel environment variables

### 3. Optional Services (if using AI features)
- OpenAI: https://platform.openai.com/api-keys
- Pinecone: https://www.pinecone.io/
- Resend: https://resend.com/

---

## Troubleshooting

### Build Fails with Prisma Error
- Ensure `DATABASE_URL` is set correctly
- Check that database is accessible from Vercel
- Run `prisma generate` locally to test

### Environment Variables Not Working
- Make sure to set them for all environments (Production, Preview, Development)
- Redeploy after adding new variables
- Check for typos in variable names

### Clerk Authentication Issues
- Verify redirect URLs are updated in Clerk Dashboard
- Check that both publishable and secret keys are set
- Ensure domain is added to Clerk's allowed origins

### 500 Internal Server Error
- Check Vercel logs: Dashboard → Deployments → Click deployment → Runtime Logs
- Verify all required environment variables are set
- Check database connection

---

## Monitoring and Logs

- **Runtime Logs**: Vercel Dashboard → Deployments → [Click deployment] → Runtime Logs
- **Build Logs**: Vercel Dashboard → Deployments → [Click deployment] → Build Logs
- **Analytics**: Vercel Dashboard → Analytics

---

## Domain Configuration (Optional)

1. Go to Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_BASE_URL` environment variable
5. Update redirect URLs in Clerk and Stripe

---

## Performance Optimization

After deployment, consider:
- Enable Vercel Analytics
- Set up proper caching headers
- Optimize images with Next.js Image component
- Enable ISR (Incremental Static Regeneration) where applicable

---

## Security Checklist

Before going live:
- [ ] All environment variables are set as "secret" in Vercel
- [ ] Database credentials are secure
- [ ] Clerk production instance is configured
- [ ] Stripe is in live mode (not test mode)
- [ ] Rate limiting is implemented (future enhancement)
- [ ] CORS settings are configured properly

---

## Next Steps After Deployment

1. Test all authentication flows
2. Test webinar creation and streaming
3. Test payment integration
4. Set up monitoring and error tracking (e.g., Sentry)
5. Configure CDN and caching
6. Set up backup strategy for database

---

## Support

If you encounter issues:
- Check Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Prisma Documentation: https://www.prisma.io/docs
- Clerk Documentation: https://clerk.com/docs

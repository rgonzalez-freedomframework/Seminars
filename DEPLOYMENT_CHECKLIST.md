# 🚀 Quick Deployment Checklist

## ✅ Completed
- [x] Database configured (Neon PostgreSQL)
- [x] Migrations applied to database
- [x] Clerk authentication keys configured
- [x] .env.example created
- [x] .env.local created for local development
- [x] vercel.json configured
- [x] package.json postinstall script added
- [x] .gitignore updated

## ⚠️ Required Before Deployment

### 1. Get Stream.io Credentials (REQUIRED for video)
- [ ] Sign up at: https://getstream.io/
- [ ] Create new app
- [ ] Copy these values to Vercel:
  - `NEXT_PUBLIC_STREAM_API_KEY`
  - `STREAM_TOKEN`
  - `STREAM_CALL_ID`
  - `NEXT_PUBLIC_STREAM_USER_ID`

### 2. Get Stripe Credentials (REQUIRED for payments)
- [ ] Sign up at: https://dashboard.stripe.com/
- [ ] Enable Stripe Connect
- [ ] Copy these values to Vercel:
  - `NEXT_PUBLIC_STRIPE_CLIENT_ID`
  - `STRIPE_SECRET_KEY`

### 3. Deploy to Vercel
- [ ] Push code to GitHub
- [ ] Import repository in Vercel
- [ ] Add ALL environment variables in Vercel Dashboard
- [ ] Deploy

### 4. Post-Deployment Configuration
- [ ] Update Clerk redirect URLs with your Vercel domain
- [ ] Update Stripe redirect URLs with your Vercel domain
- [ ] Update `NEXT_PUBLIC_BASE_URL` in Vercel to your deployed URL
- [ ] Redeploy to apply URL changes

## 🔍 Test After Deployment
- [ ] Sign up / Sign in works
- [ ] Can create a webinar
- [ ] Webinar list displays
- [ ] Settings page loads
- [ ] No console errors in browser

## 📝 Environment Variables Summary

### Already Configured:
- ✅ DATABASE_URL
- ✅ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- ✅ CLERK_SECRET_KEY

### Needs Configuration:
- ⚠️ NEXT_PUBLIC_STREAM_API_KEY
- ⚠️ STREAM_TOKEN
- ⚠️ STREAM_CALL_ID
- ⚠️ NEXT_PUBLIC_STREAM_USER_ID
- ⚠️ NEXT_PUBLIC_STRIPE_CLIENT_ID
- ⚠️ STRIPE_SECRET_KEY
- ⚠️ NEXT_PUBLIC_BASE_URL (update after deployment)

### Optional (for AI features):
- ⭕ OPENAI_API_KEY
- ⭕ PINECONE_API_KEY
- ⭕ RESEND_API_KEY

## 🚨 Known Issues to Fix (See review document)

1. Stripe toggle button uses mock data - needs real OAuth flow
2. Remove console.log statements for production
3. Add error boundaries
4. Implement rate limiting
5. Add input sanitization

## 📚 Documentation Created
- DEPLOYMENT.md - Full deployment guide
- .env.example - Environment variable template
- vercel.json - Vercel configuration

## 🎯 Quick Deploy Command

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables when prompted
# Or add them in Vercel Dashboard afterwards
```

## 💡 Important Notes

- **Node.js Version**: Project uses Node 20.x (compatible with Vercel) ✅
- **Next.js Version**: 15.2.4 (latest, fully supported) ✅
- **Database**: Neon PostgreSQL (serverless, Vercel-optimized) ✅
- **Build Time**: First build ~3-5 minutes (includes Prisma generation)

## 🔗 Useful Links

- Vercel Dashboard: https://vercel.com/dashboard
- Clerk Dashboard: https://dashboard.clerk.com/
- Stream.io Dashboard: https://getstream.io/dashboard/
- Stripe Dashboard: https://dashboard.stripe.com/
- Neon Dashboard: https://console.neon.tech/

---

**Ready to deploy?** Follow DEPLOYMENT.md for detailed instructions!

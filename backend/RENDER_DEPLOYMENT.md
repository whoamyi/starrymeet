# StarryMeet Backend - Render Deployment Guide

## Pre-Deployment Checklist

✅ Environment variables configured in Neon
✅ Resend API key configured
✅ Stripe keys ready (use test keys first)
✅ Frontend URL updated in .env
✅ Database migrated to Neon PostgreSQL

## Render Setup Instructions

### 1. Create New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the `starrymeet` repository

### 2. Configure Build Settings

**Basic Settings:**
- **Name:** `starrymeet-backend` (or your preferred name)
- **Region:** Choose closest to your users
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `node dist/server.js`

**IMPORTANT:** Use `node dist/server.js` NOT `npm start` to avoid path issues

**Instance Type:**
- Start with **Free** tier for testing
- Upgrade to **Starter** ($7/month) for production

### 3. Environment Variables

Add these in Render Dashboard → Environment → Environment Variables:

```bash
NODE_ENV=production
PORT=3000

# Database (from your Neon dashboard)
DB_HOST=ep-autumn-haze-adth19vt-pooler.c-2.us-east-1.aws.neon.tech
DB_PORT=5432
DB_NAME=neondb
DB_USER=neondb_owner
DB_PASSWORD=npg_Bw8Nn5oiaCgT

# JWT (your generated secret)
JWT_SECRET=d0e19b091b9c3d729c86f66ef6f765c4e5889b8a3aff04c062ddab42c292809e13c348de61ff675d099bb0d2881e3d7d9f0b12220d25b2fc927990d10baca603
JWT_EXPIRES_IN=7d

# Stripe (start with test keys)
STRIPE_SECRET_KEY=sk_test_your_test_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Resend Email
RESEND_API_KEY=re_aqQ9Tbfr_MtieRoVWkNCQWZJ464qbTFx1
RESEND_FROM_EMAIL=noreply@starrymeet.com

# Frontend URL (your GitHub Pages URL)
FRONTEND_URL=https://whoamyi.github.io/starrymeet/
```

### 4. Health Check Path

Set Health Check Path to: `/health`

This ensures Render can monitor your service health.

### 5. Deploy

1. Click "Create Web Service"
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Build the TypeScript code
   - Start the server
3. Wait for deployment to complete (usually 2-5 minutes)

### 6. Post-Deployment

**Get your API URL:**
Your API will be available at: `https://starrymeet-backend.onrender.com`

**Test the deployment:**
```bash
# Health check
curl https://your-app-name.onrender.com/health

# Should return:
# {"success":true,"message":"StarryMeet API is running","timestamp":"..."}
```

**Update Frontend:**
Update your frontend to use the new Render API URL instead of localhost.

### 7. Configure Stripe Webhook (Production)

Once deployed:

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-app-name.onrender.com/api/payments/webhook`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the webhook signing secret
6. Update `STRIPE_WEBHOOK_SECRET` in Render environment variables

### 8. Domain Configuration (Optional)

To use a custom domain:
1. Go to Render Dashboard → Settings → Custom Domains
2. Add your domain
3. Update DNS records as instructed
4. Update `FRONTEND_URL` environment variable

## Monitoring

**View Logs:**
- Render Dashboard → Logs tab
- Real-time streaming logs
- Filter by severity

**Metrics:**
- Monitor CPU, Memory usage
- Request latency
- Error rates

## Troubleshooting

### Build Fails
- Check build logs in Render Dashboard
- Verify `package.json` has all dependencies
- Ensure TypeScript builds locally: `npm run build`

### Database Connection Issues
- Verify Neon database credentials
- Check Neon database is not paused (free tier auto-pauses)
- Ensure SSL is enabled in database config

### 500 Errors
- Check Render logs for error details
- Verify all environment variables are set
- Test health endpoint

### CORS Errors
- Verify `FRONTEND_URL` matches your actual frontend URL
- Check CORS configuration in `server.ts`

## Security Notes

✅ All sensitive data in environment variables
✅ `.env` files excluded from git
✅ Helmet.js security headers enabled
✅ CORS restricted to frontend URL
✅ SSL/TLS enabled via Neon and Render
✅ JWT secrets are cryptographically strong

## Scaling

**Free Tier Limitations:**
- Spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month free

**Upgrade to Starter ($7/month) for:**
- No spin-down
- Better performance
- Custom domains
- More RAM/CPU

## Support

- **Render Docs:** https://render.com/docs
- **Neon Docs:** https://neon.tech/docs
- **Resend Docs:** https://resend.com/docs

## Next Steps

1. ✅ Deploy to Render
2. Test all API endpoints
3. Update frontend with production API URL
4. Configure Stripe webhooks
5. Test complete user flow (signup → booking → payment)
6. Monitor logs for errors
7. Consider upgrading to Starter tier

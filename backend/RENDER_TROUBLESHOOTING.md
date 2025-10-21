# Render Deployment Troubleshooting

## Error: Cannot find module '/opt/render/project/src/backend/dist/server.js'

This error occurs when the Root Directory and Start Command don't align properly.

### ✅ Solution

**In Render Dashboard, verify these EXACT settings:**

1. **Root Directory:** `backend`
2. **Start Command:** `node dist/server.js`

**NOT:**
- ❌ `npm start`
- ❌ `npm run start`
- ❌ `node backend/dist/server.js`
- ❌ `node ./dist/server.js`

### Why This Happens

When you set **Root Directory** to `backend`:
- Render's working directory becomes `/opt/render/project/src/backend/`
- So `dist/server.js` is at `/opt/render/project/src/backend/dist/server.js`
- Running `node dist/server.js` correctly points to this file

If you use `npm start`:
- npm might resolve paths differently
- Can cause path resolution issues

### Alternative: Use render.yaml

Instead of manual configuration, use the `render.yaml` file in the root of your repo:

```yaml
services:
  - type: web
    name: starrymeet-backend
    runtime: node
    rootDir: backend
    buildCommand: npm install && npm run build
    startCommand: node dist/server.js
    healthCheckPath: /health
```

Render will automatically use these settings.

## Other Common Errors

### Build Fails: "Cannot find package.json"

**Cause:** Root Directory not set to `backend`

**Fix:**
- Set Root Directory to `backend` in Render settings
- Or use render.yaml

### Error: "Module not found: @/..."

**Cause:** TypeScript path aliases not resolving

**Fix:**
- These are compile-time only
- Build should handle this (already configured in tsconfig.json)
- Verify `npm run build` works locally

### Database Connection Timeout

**Cause:** Neon database credentials incorrect or database paused

**Fix:**
1. Check Neon dashboard - database might be paused (free tier)
2. Verify all DB_* environment variables in Render
3. Ensure DB_HOST includes full Neon hostname
4. Check DB_PORT is 5432

### CORS Error

**Cause:** FRONTEND_URL doesn't match actual frontend URL

**Fix:**
1. Check FRONTEND_URL environment variable
2. Must match exactly (including https://)
3. No trailing slash
4. Example: `https://whoamyi.github.io/starrymeet`

### Server Starts But Health Check Fails

**Cause:** Health check path incorrect

**Fix:**
- Set Health Check Path to `/health`
- Test endpoint: `curl https://your-app.onrender.com/health`

### Environment Variables Not Loading

**Cause:** Variables not set in Render dashboard

**Fix:**
1. Go to Render Dashboard → Environment
2. Add all variables from DEPLOYMENT_CHECKLIST.md
3. Redeploy after adding variables

### Build Succeeds But Start Fails

**Check Render Logs:**

```bash
# Look for specific error messages
- "Cannot find module" → Missing dependency
- "Port already in use" → Should not happen on Render
- "Database connection failed" → Check DB credentials
- "JWT_SECRET not defined" → Missing env var
```

## Verification Checklist

Before asking for help, verify:

- [ ] Root Directory is set to `backend`
- [ ] Start Command is `node dist/server.js`
- [ ] Build Command is `npm install && npm run build`
- [ ] Health Check Path is `/health`
- [ ] All environment variables are set
- [ ] Build logs show "Build succeeded"
- [ ] Start logs show "Server running on port 3000"

## Getting Logs

**View Real-time Logs:**
1. Render Dashboard → Your Service → Logs tab
2. Shows build logs and runtime logs
3. Filter by severity (Info, Warning, Error)

**Download Logs:**
- Click "Download" in Logs tab
- Useful for debugging

## Still Having Issues?

1. **Test locally first:**
   ```bash
   cd backend
   npm install
   npm run build
   node dist/server.js
   ```
   If this works, issue is with Render config.

2. **Check render.yaml:**
   - Ensure it's in the repository root
   - Push to GitHub
   - Render will auto-detect it

3. **Manual Deploy:**
   - Render Dashboard → Manual Deploy
   - Click "Clear build cache & deploy"
   - Sometimes fixes cached issues

4. **Check Render Status:**
   - Visit https://status.render.com
   - Ensure no ongoing incidents

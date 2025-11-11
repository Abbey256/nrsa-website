# Render Deployment Guide - NRSA Application
## Complete Step-by-Step Instructions for Deploying on Render.com

---

## 🚀 Quick Overview

This guide covers deploying the NRSA (Nigeria Rope Skipping Association) full-stack application on **Render.com** with:
- **Single Web Service** serving both frontend and backend
- **PostgreSQL Database** (managed by Render)
- **Supabase Storage** (external service for file uploads)
- **Automatic deployments** from Git repository

**Architecture:**
```
┌─────────────────────────────────────────────┐
│   Render Web Service (nrsa-backend)         │
│   ├─ Port: 5000                             │
│   ├─ Serves: Static frontend (React)        │
│   ├─ Serves: Backend API (/api/*)           │
│   └─ Connects to: PostgreSQL + Supabase     │
└─────────────────────────────────────────────┘
```

---

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ GitHub/GitLab/Bitbucket repository with your code
- ✅ Render account (free tier available at [render.com](https://render.com))
- ✅ Supabase account with a project created
- ✅ Supabase Storage bucket named `nrsa-uploads` created

---

## ⚠️ Common Deployment Errors & Fixes

### Error 1: "Module not found" or "Cannot find package"

**Cause:** Missing dependencies or incorrect build configuration

**Fix:**
1. Ensure `package.json` has all dependencies listed
2. Run `npm install` locally to verify
3. Check that `build` script runs successfully: `npm run build`

### Error 2: "Build failed" or "TypeScript compilation errors"

**Cause:** TypeScript errors in the code

**Fix:**
1. Run `npm run check` locally to see TypeScript errors
2. Fix all TypeScript errors before deploying
3. Ensure `tsconfig.json` and `tsconfig.backend.json` are correct

### Error 3: "Application failed to respond" or "Service Unavailable"

**Cause:** Server not binding to correct port or crashing on startup

**Fix:**
1. Verify `server/index.ts` uses `process.env.PORT || 5000`
2. Check Render logs for startup errors
3. Ensure environment variables are set correctly

### Error 4: "Database connection failed"

**Cause:** Missing or incorrect DATABASE_URL

**Fix:**
1. Ensure PostgreSQL database is created in Render
2. Link database to web service
3. Verify DATABASE_URL is automatically added to environment variables

### Error 5: "CORS errors" in browser console

**Cause:** Frontend trying to call API from different origin

**Fix:**
- This is already handled in the code since both frontend and backend are on the same domain
- No CORS configuration needed for Render deployment

---

## 🛠️ Step-by-Step Deployment

### Step 1: Prepare Your Repository

#### 1.1 Push Code to Git Repository

```bash
# If not already initialized
git init
git add .
git commit -m "Initial commit for Render deployment"

# Push to your GitHub repository
git remote add origin https://github.com/your-username/nrsa-app.git
git push -u origin main
```

#### 1.2 Verify Required Files

Ensure these files exist in your repository:
- ✅ `package.json` - Dependencies and scripts
- ✅ `render.yaml` - Render deployment configuration (optional but recommended)
- ✅ `tsconfig.json` - TypeScript configuration
- ✅ `server/index.ts` - Backend entry point
- ✅ `vite.config.ts` - Frontend build configuration

---

### Step 2: Create PostgreSQL Database on Render

1. **Login to Render Dashboard** → [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → Select **"PostgreSQL"**
3. **Configure Database:**

| Field | Value |
|-------|-------|
| **Name** | `nrsa-postgres` |
| **Database** | `nrsa_production` |
| **User** | `nrsa_user` (auto-generated) |
| **Region** | Oregon (US West) or closest to you |
| **Plan** | Free (or Starter for production) |

4. Click **"Create Database"**
5. **Wait 2-3 minutes** for database provisioning
6. **Copy the Internal Database URL** (will use this later)

---

### Step 3: Create Web Service on Render

1. **From Render Dashboard** → Click **"New +"** → Select **"Web Service"**
2. **Connect Repository:**
   - Click **"Connect a repository"**
   - Authorize Render to access your GitHub/GitLab
   - Select your NRSA repository

3. **Configure Web Service:**

| Field | Value | Notes |
|-------|-------|-------|
| **Name** | `nrsa-backend` | Will become your-app.onrender.com |
| **Region** | Oregon (US West) | Same as database |
| **Branch** | `main` | Or your default branch |
| **Root Directory** | `.` (leave empty) | Deploy from repo root |
| **Runtime** | `Node` | Auto-detected |
| **Build Command** | `npm install && npm run build` | **Critical** |
| **Start Command** | `npm start` | **Critical** |
| **Plan** | Free | Or paid for better performance |

4. Click **"Advanced"** to add environment variables

---

### Step 4: Configure Environment Variables

In the **Environment Variables** section, add the following:

#### Required Environment Variables:

| Variable Name | Value | Where to Get It |
|--------------|-------|-----------------|
| `NODE_ENV` | `production` | Type manually |
| `DATABASE_URL` | *Auto-filled by Render* | Link database (see below) |
| `JWT_SECRET` | `your-secure-random-64-char-string` | Generate with: `openssl rand -base64 48` |
| `SUPABASE_URL` | `https://xxxxx.supabase.co` | Supabase Dashboard → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` | Supabase Dashboard → Project Settings → API → service_role key |
| `SUPABASE_ANON_KEY` | `eyJhbGci...` | Supabase Dashboard → Project Settings → API → anon public key |
| `ADMIN_EMAIL` | `admin@nrsa.com.ng` | Your admin email |
| `ADMIN_PASSWORD` | `YourSecurePassword123!` | **CHANGE THIS** - Strong password (12+ chars) |
| `ADMIN_NAME` | `NRSA Administrator` | Admin display name |

⚠️ **CRITICAL FOR RENDER:** Do **NOT** set `VITE_API_URL` environment variable. Leave it unset for same-origin API calls (frontend and backend are on the same Render service).

#### How to Link Database:

1. Scroll down to **"Environment Variables"**
2. Click **"Add from Database"**
3. Select your `nrsa-postgres` database
4. DATABASE_URL will be automatically added

#### Generate JWT_SECRET:

```bash
# On Linux/Mac
openssl rand -base64 48

# On Windows (PowerShell)
[Convert]::ToBase64String([byte[]](1..48|%{Get-Random -Minimum 0 -Maximum 256}))

# Example output:
# r7GKvXz4Hj9mP2LqN8wF5sY1tE3xC6bV0nA9dU4kM7iO2pS8gR1fT5hJ3lW
```

#### Get Supabase Credentials:

1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project
3. Click **Settings** (gear icon) → **API**
4. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **Project API keys** → `anon public` → `SUPABASE_ANON_KEY`
   - **Project API keys** → `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **IMPORTANT:** Never commit these secrets to Git!

---

### Step 5: Deploy the Application

1. **Review all settings** - Double-check environment variables
2. Click **"Create Web Service"** (or "Deploy" if already created)
3. **Wait for Build** (5-10 minutes for first deployment)
4. **Monitor Build Logs** - Watch for errors

**Expected Build Output:**
```
==> Building application
==> Downloading Node.js version 20.x.x
==> Running 'npm install && npm run build'
    added 1234 packages in 45s
==> Building frontend...
    ✓ built in 2m 15s
==> Building backend...
    ✓ compiled successfully
==> Build succeeded
==> Deploying...
==> Your service is live 🎉
```

---

### Step 6: Initialize Database Schema

After successful deployment, you need to push the database schema:

#### Option A: Via Render Shell (Recommended)

1. Go to your **nrsa-backend** service on Render
2. Click **"Shell"** tab
3. Run these commands:

```bash
# Push database schema
npm run db:push

# If it fails, force push
npm run db:push --force

# Create super-admin account
node dist/server/createAdmin.js
```

**Expected Output:**
```
✓ Schema pushed successfully!
✅ Super-admin account created successfully
   Email: admin@nrsa.com.ng
   Name: NRSA Administrator
```

#### Option B: Via Render Deploy Hook

If Shell access is not available, you can add a post-deploy hook:

1. Edit `package.json` to add:

```json
{
  "scripts": {
    "postbuild": "npm run db:push && node dist/server/createAdmin.js"
  }
}
```

2. Commit and push to trigger redeploy

⚠️ **Warning:** This will run on every deployment, so the admin creation script should handle "already exists" gracefully (which it does).

---

### Step 7: Verify Deployment

#### 7.1 Check Service Status

1. In Render Dashboard, verify status shows **"Live"** (green dot)
2. Note your app URL: `https://nrsa-backend.onrender.com`

#### 7.2 Test Backend API

Open these URLs in your browser:

```
✓ Health Check:
https://nrsa-backend.onrender.com/

✓ Hero Slides:
https://nrsa-backend.onrender.com/api/hero-slides

✓ News:
https://nrsa-backend.onrender.com/api/news

✓ Events:
https://nrsa-backend.onrender.com/api/events
```

**Expected Response:** JSON arrays (empty `[]` or with data)

#### 7.3 Test Frontend

1. Visit: `https://nrsa-backend.onrender.com`
2. Should load the NRSA homepage
3. Navigate through pages: About, Events, Players, News, Media
4. All pages should load without errors

#### 7.4 Test Admin Login

1. Visit: `https://nrsa-backend.onrender.com/admin/login`
2. Enter credentials:
   - **Email:** `admin@nrsa.com.ng`
   - **Password:** (the one you set in ADMIN_PASSWORD)
3. Should redirect to admin dashboard

#### 7.5 Test File Upload

1. Login to admin panel
2. Go to **Media** section
3. Click **"Add Media"**
4. Upload an image file
5. Verify it appears in the media list
6. Check Supabase Storage bucket to confirm file uploaded

---

## 🔧 Troubleshooting Common Issues

### Issue 1: Build Fails with "Module not found"

**Error:**
```
Error: Cannot find module '@shared/schema'
```

**Solution:**
Ensure `tsconfig-paths` is installed and `start` script uses it:

```json
{
  "scripts": {
    "start": "cross-env NODE_ENV=production node -r tsconfig-paths/register dist/server/index.js"
  }
}
```

---

### Issue 2: Database Connection Timeout

**Error:**
```
Error: connect ETIMEDOUT
```

**Solution:**
1. Ensure DATABASE_URL is linked from Render PostgreSQL
2. Check database is in same region as web service
3. Verify database is not paused (free tier databases can pause)

**Test Connection:**
```bash
# In Render Shell
echo $DATABASE_URL
node -e "const pg = require('pg'); const client = new pg.Client(process.env.DATABASE_URL); client.connect().then(() => console.log('Connected!')).catch(console.error);"
```

---

### Issue 3: Application Crashes on Startup

**Error:**
```
Service exited with code 1
```

**Solution:**

1. **Check Render Logs** (Dashboard → Logs tab)
2. **Common causes:**
   - Missing environment variables
   - Database schema not pushed
   - Port binding error

**Debug in Render Shell:**
```bash
# Check environment variables
env | grep -E 'DATABASE|SUPABASE|JWT|ADMIN'

# Test server startup
npm start

# Check compiled files
ls -la dist/server/
```

---

### Issue 4: Admin Login Returns "Invalid credentials"

**Causes:**
- Admin account not created
- Wrong password
- Database schema not pushed

**Solution:**

```bash
# Render Shell
# 1. Check if admins table exists
echo "SELECT * FROM admins;" | node -e "const pg = require('pg'); const client = new pg.Client(process.env.DATABASE_URL); client.connect().then(() => client.query('SELECT email, role FROM admins')).then(r => console.log(r.rows)).catch(console.error);"

# 2. Recreate admin account
node dist/server/createAdmin.js

# 3. Verify creation
echo "SELECT email FROM admins;" | node -e "..."
```

---

### Issue 5: File Uploads Fail (503 Error)

**Error:**
```
File upload service temporarily unavailable
```

**Cause:** Supabase environment variables not set or incorrect

**Solution:**

1. **Verify Supabase Variables:**
   - Render Dashboard → Environment → Check `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
   
2. **Test Supabase Connection:**
   ```bash
   # Render Shell
   node -e "const { createClient } = require('@supabase/supabase-js'); const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY); sb.storage.listBuckets().then(r => console.log('Buckets:', r)).catch(console.error);"
   ```

3. **Create Bucket if Missing:**
   - Supabase Dashboard → Storage → Create bucket `nrsa-uploads`
   - Set to **Public** access

---

### Issue 6: Frontend Shows Blank Page

**Causes:**
- Build failed silently
- Static files not generated
- Incorrect Vite configuration

**Solution:**

```bash
# Local machine - test build
npm run build

# Check output
ls -la dist/public/
# Should contain: index.html, assets/ folder

# Verify Vite config serves static files in production
cat server/index.ts | grep "vite.ts"
```

**Verify `server/index.ts` includes:**
```typescript
if (process.env.NODE_ENV === "production") {
  const { serveStatic } = await import("./vite.js");
  serveStatic(app);
}
```

---

### Issue 7: "Application Timeout" Error

**Error:**
```
Error: Application failed to respond within 30 seconds
```

**Cause:** Server taking too long to start (common on free tier)

**Solutions:**

1. **Reduce Dependencies:**
   - Check for unnecessary dependencies in `package.json`
   - Use `npm prune --production` to remove dev dependencies

2. **Optimize Build:**
   - Ensure `NODE_ENV=production` is set
   - Check build script doesn't include unnecessary steps

3. **Increase Health Check Timeout:**
   - Render Dashboard → Settings → Health Check Path
   - Set to `/` (your server responds to this)

---

## 🔒 Security Checklist

Before going live, verify:

- [ ] `JWT_SECRET` is a random 48+ character string (not default)
- [ ] `ADMIN_PASSWORD` is strong (12+ chars, uppercase, lowercase, numbers, symbols)
- [ ] Supabase `service_role` key is set in environment variables (not in code)
- [ ] Database credentials are from Render (never hardcoded)
- [ ] `.env` file is in `.gitignore` (never commit secrets)
- [ ] CORS is not set to `*` in production (already handled in code)

---

## 🚀 Custom Domain Setup (Optional)

To use your own domain (e.g., `nrsa.com.ng`):

1. **In Render Dashboard:**
   - Go to your web service
   - Click **Settings** → **Custom Domain**
   - Click **"Add Custom Domain"**
   - Enter: `nrsa.com.ng`

2. **In Your DNS Provider:**
   - Add CNAME record:
     - **Name:** `@` (or blank)
     - **Value:** `nrsa-backend.onrender.com`
   - Or A record:
     - **Name:** `@`
     - **Value:** (IP address provided by Render)

3. **Wait for DNS Propagation** (5-60 minutes)
4. **Render will automatically provision SSL** (Let's Encrypt)

**Result:** Your app will be accessible at `https://nrsa.com.ng`

---

## 📊 Monitoring & Logs

### View Logs

1. **Real-time Logs:**
   - Render Dashboard → Your Service → **Logs** tab
   - Shows server output, errors, requests

2. **Filter Logs:**
   ```
   [INFO]  - Normal operations
   [ERROR] - Errors and exceptions
   [WARN]  - Warnings
   ```

### Monitor Performance

1. **Render Dashboard → Metrics:**
   - CPU usage
   - Memory usage
   - Request rate
   - Response time

### Set Up Alerts (Paid Plans)

- Render Dashboard → Settings → Notifications
- Configure alerts for:
  - Service down
  - High error rate
  - Deployment failures

---

## 🔄 Updating Your Application

### Automatic Deployments (Recommended)

1. **Enable Auto-Deploy:**
   - Render Dashboard → Settings → Build & Deploy
   - Enable **"Auto-Deploy: Yes"**

2. **Make Changes Locally:**
   ```bash
   # Edit code
   git add .
   git commit -m "Update feature X"
   git push origin main
   ```

3. **Render Automatically:**
   - Detects push
   - Builds new version
   - Deploys if build succeeds
   - Rolls back if deployment fails

### Manual Deployments

1. Render Dashboard → Your Service
2. Click **"Manual Deploy"** → Select branch
3. Click **"Deploy"**

### Rollback to Previous Version

1. Render Dashboard → Events tab
2. Find successful deployment
3. Click **"Rollback to this deploy"**

---

## 💰 Cost Considerations

### Free Tier Limitations

- **Web Service:**
  - 750 hours/month (enough for 1 service 24/7)
  - Spins down after 15 minutes of inactivity
  - Cold start: 30-60 seconds

- **PostgreSQL:**
  - 1GB storage
  - Expires after 90 days (need to redeploy)
  - No automatic backups

### Upgrading (Paid Plans)

| Plan | Web Service | Database | Benefits |
|------|------------|----------|----------|
| **Free** | $0/month | $0/month | Good for testing |
| **Starter** | $7/month | $7/month | No sleep, faster, backups |
| **Standard** | $25/month | $20/month | More resources, monitoring |

**Recommendation for Production:** Upgrade web service to Starter ($7/month) to prevent cold starts.

---

## 📝 Post-Deployment Tasks

After successful deployment:

### 1. Test All Features

- [ ] Homepage loads
- [ ] All navigation links work
- [ ] Admin login functional
- [ ] CRUD operations work (News, Events, Players, etc.)
- [ ] File uploads to Supabase work
- [ ] YouTube video thumbnails generate correctly
- [ ] Contact form submissions save to database

### 2. Populate Initial Data

Via Admin Dashboard:
- [ ] Upload hero slider images
- [ ] Add news articles
- [ ] Create event listings
- [ ] Upload player profiles
- [ ] Add executive leadership profiles
- [ ] Upload media gallery items

### 3. Configure Site Settings

- [ ] Update site name, tagline
- [ ] Set mission and vision statements
- [ ] Add contact information
- [ ] Configure social media links

### 4. Set Up Monitoring

- [ ] UptimeRobot or similar (free tier available)
- [ ] Configure email alerts for downtime
- [ ] Set up weekly reports

### 5. Backup Strategy

**Free Tier:**
- Manually export database weekly:
  ```bash
  # Get database connection string from Render
  pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
  ```

**Paid Tier:**
- Enable automatic daily backups in Render

---

## 🆘 Getting Help

### Render Support

- **Documentation:** [render.com/docs](https://render.com/docs)
- **Community:** [community.render.com](https://community.render.com)
- **Status:** [status.render.com](https://status.render.com)

### Application Issues

- **Check Logs:** Render Dashboard → Logs tab
- **Shell Access:** Render Dashboard → Shell tab
- **Database Access:** Use provided DATABASE_URL with `psql`

### Common Commands

```bash
# View environment variables
env

# Check Node version
node --version

# Test database connection
echo "SELECT version();" | psql $DATABASE_URL

# View running processes
ps aux

# Check disk space
df -h

# View application files
ls -la dist/

# Restart application (redeploy)
# Render Dashboard → Manual Deploy
```

---

## ✅ Deployment Checklist

Use this checklist for every deployment:

**Pre-Deployment:**
- [ ] Code committed to Git repository
- [ ] Ran `npm run build` locally successfully
- [ ] No TypeScript errors (`npm run check`)
- [ ] Environment variables documented
- [ ] Supabase bucket `nrsa-uploads` created

**Render Configuration:**
- [ ] PostgreSQL database created
- [ ] Web service created and linked to repository
- [ ] Build command: `npm install && npm run build`
- [ ] Start command: `npm start`
- [ ] All environment variables added
- [ ] Database linked to web service

**Post-Deployment:**
- [ ] Build completed successfully
- [ ] Application status shows "Live"
- [ ] Ran `npm run db:push` in Shell
- [ ] Created admin account
- [ ] Tested admin login
- [ ] All API endpoints responding
- [ ] Frontend loads correctly
- [ ] File uploads working

**Go-Live:**
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] All features tested end-to-end
- [ ] Monitoring configured
- [ ] Backup strategy in place

---

## 📚 Additional Resources

- **Render Node.js Deployment:** [render.com/docs/deploy-node-express-app](https://render.com/docs/deploy-node-express-app)
- **PostgreSQL on Render:** [render.com/docs/databases](https://render.com/docs/databases)
- **Environment Variables:** [render.com/docs/environment-variables](https://render.com/docs/environment-variables)
- **Custom Domains:** [render.com/docs/custom-domains](https://render.com/docs/custom-domains)

---

**Last Updated:** November 11, 2025  
**Version:** 1.0.0  
**Platform:** Render.com  
**Application:** NRSA (Nigeria Rope Skipping Association)

---

## Summary

This guide provides comprehensive instructions for deploying the NRSA application on Render with:
- ✅ Single web service architecture (frontend + backend)
- ✅ Managed PostgreSQL database
- ✅ Environment variable configuration
- ✅ Database schema initialization
- ✅ Admin account creation
- ✅ Troubleshooting for common errors
- ✅ Security best practices
- ✅ Monitoring and maintenance procedures

Follow the steps in order, and you'll have your application running on Render successfully! 🚀

# Vercel Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Prepare Your Repository

```bash
# Initialize git (if not already done)
git init

# Create .gitignore to exclude sensitive files
echo "node_modules/
.next/
.env.local
.env
*.log" > .gitignore

# Add all files
git add .

# Commit
git commit -m "Smart Bookmarks App - Ready for deployment"

# Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/smart-bookmarks.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

#### Option A: Via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `yarn build` (default)
   - **Output Directory**: `.next` (default)

5. Add **Environment Variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://pcwyduojzmdcwbrktyhq.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjd3lkdW9qem1kY3dicmt0aHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNDUwNzMsImV4cCI6MjA4NjgyMTA3M30.CpCa5TT1RPzP13D1V92zZCPgCSpCIZvoh0bFy_olJ-o
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjd3lkdW9qem1kY3dicmt0aHlxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTI0NTA3MywiZXhwIjoyMDg2ODIxMDczfQ.kfu_iyCNMzAqyLOSgCq4ejRBgSU0md7D_I_e6JVhuQk
   ```

6. Click **"Deploy"**

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts and add environment variables when asked
```

### 3. Post-Deployment Configuration

#### A. Update Google OAuth Redirect URIs

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services → Credentials**
3. Select your OAuth Client ID
4. Add to **Authorized redirect URIs**:
   ```
   https://your-app-name.vercel.app
   https://pcwyduojzmdcwbrktyhq.supabase.co/auth/v1/callback
   ```
5. Click **Save**

#### B. Update Supabase URL Configuration

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication → URL Configuration**
4. Update **Site URL**: `https://your-app-name.vercel.app`
5. Add to **Redirect URLs**: `https://your-app-name.vercel.app/**`
6. Click **Save**

### 4. Verify Deployment

1. Visit your Vercel URL: `https://your-app-name.vercel.app`
2. Click "Sign in with Google"
3. Complete OAuth flow
4. Add a bookmark
5. Open in another tab and verify real-time sync

## 🔧 Troubleshooting

### Build Fails on Vercel

**Problem**: Build fails with module errors

**Solution**:
```bash
# Ensure package.json has all dependencies
yarn install

# Test build locally first
yarn build

# If successful, push changes
git add package.json yarn.lock
git commit -m "Update dependencies"
git push
```

### Google OAuth Not Working

**Problem**: Redirect loop or OAuth errors

**Solution**:
- Verify Vercel URL is added to Google OAuth redirect URIs
- Check Supabase Site URL matches Vercel deployment URL
- Ensure environment variables are set in Vercel dashboard

### Environment Variables Not Loading

**Problem**: Supabase errors about invalid URL

**Solution**:
- In Vercel dashboard, go to Settings → Environment Variables
- Verify all three variables are present
- Redeploy: Deployments → ⋯ → Redeploy

### Real-time Not Working in Production

**Problem**: Bookmarks don't sync across tabs

**Solution**:
- Verify realtime is enabled in Supabase: `ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;`
- Check browser console for WebSocket connection errors
- Ensure Supabase anon key is correct in Vercel environment variables

## 📊 Monitoring

### Vercel Analytics

- Go to your project in Vercel
- Click **Analytics** tab
- Monitor page views, visitor count, performance

### Supabase Logs

- Go to Supabase Dashboard
- Click **Logs** → **Auth Logs** (for login issues)
- Click **Logs** → **Database Logs** (for query issues)

## 🎯 Performance Optimization

1. **Edge Runtime**: Consider using Edge runtime for faster response times
2. **Image Optimization**: If adding user avatars, use Next.js Image component
3. **Caching**: Leverage Vercel's edge caching for static assets
4. **Database Indexes**: Already added in DATABASE_SETUP.md

## 🔒 Security Checklist

- ✅ Environment variables never committed to git
- ✅ Row Level Security enabled in Supabase
- ✅ HTTPS only (enforced by Vercel)
- ✅ CORS properly configured
- ✅ Service role key kept server-side only
- ✅ Anon key safe for client-side use

## 📝 Custom Domain (Optional)

1. Buy a domain (e.g., from Namecheap, Google Domains)
2. In Vercel: Settings → Domains
3. Add your domain
4. Update DNS records as instructed by Vercel
5. Update Google OAuth and Supabase URLs to use your custom domain

## 🚀 Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Add new feature"
git push

# Vercel automatically builds and deploys
```

---

**Your app will be live at**: `https://your-app-name.vercel.app`

**Database runs on**: Supabase (PostgreSQL)

**Authentication**: Google OAuth via Supabase Auth

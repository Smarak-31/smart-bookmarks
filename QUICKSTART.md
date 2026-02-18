# 🚀 Quick Start Guide

## ⚠️ IMPORTANT: Database Setup Required

Before you can use the app, you MUST set up the database in Supabase.

### Step 1: Set Up Database (5 minutes)

1. Open your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `pcwyduojzmdcwbrkthyq`
3. Click **"SQL Editor"** in the left sidebar
4. Copy ALL the SQL commands from `DATABASE_SETUP.md`
5. Paste them into the SQL Editor
6. Click **"Run"**

**This creates:**
- The `bookmarks` table
- Row Level Security (RLS) policies for privacy
- Real-time subscriptions for instant sync

### Step 2: Test Locally (2 minutes)

The app is already running at:
- **Local**: http://localhost:3000
- **Preview**: https://bookmark-hub-18.preview.emergentagent.com

**To test:**
1. Open the preview URL
2. Click "Sign in with Google"
3. Complete the OAuth flow
4. Add a bookmark
5. Open another tab and verify real-time sync works

### Step 3: Deploy to Vercel (10 minutes)

Follow the complete guide in `DEPLOYMENT.md`:

**Quick version:**
```bash
# 1. Initialize git and push to GitHub
git init
git add .
git commit -m "Smart Bookmarks App"
git remote add origin https://github.com/YOUR_USERNAME/smart-bookmarks.git
git push -u origin main

# 2. Deploy to Vercel
# - Go to vercel.com
# - Import your GitHub repo
# - Add environment variables (see DEPLOYMENT.md)
# - Click Deploy

# 3. Update Google OAuth redirect URIs
# - Add your Vercel URL to Google Cloud Console
# - See DEPLOYMENT.md for detailed steps
```

## 📚 Documentation

- **README.md** - Full project documentation
- **DATABASE_SETUP.md** - Required SQL setup (DO THIS FIRST!)
- **DEPLOYMENT.md** - Complete Vercel deployment guide

## ✅ Features Checklist

- ✅ Google OAuth authentication
- ✅ Private bookmarks per user
- ✅ Real-time sync across tabs
- ✅ Add bookmarks (URL + title)
- ✅ Delete bookmarks
- ✅ Beautiful UI with Tailwind CSS
- ✅ Row Level Security for data privacy
- ✅ Responsive design
- ✅ Ready for Vercel deployment

## 🐛 Troubleshooting

### "Sign in with Google" button doesn't work

**Cause**: Google OAuth not configured in Supabase

**Fix**:
1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google
3. Add your Google Client ID and Secret
4. See README.md for detailed setup

### Bookmarks don't appear

**Cause**: Database not set up

**Fix**: Run ALL SQL commands from `DATABASE_SETUP.md` in Supabase SQL Editor

### Real-time sync not working

**Cause**: Realtime not enabled for bookmarks table

**Fix**: Run this SQL command:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookmarks;
```

## 🎯 Testing Checklist

- [ ] Database setup complete (SQL commands run)
- [ ] Can sign in with Google
- [ ] Can add a bookmark
- [ ] Bookmark appears in list
- [ ] Can delete a bookmark
- [ ] Real-time sync works (test in two tabs)
- [ ] Different users can't see each other's bookmarks
- [ ] App deployed to Vercel
- [ ] Google OAuth works on production URL

## 📞 Need Help?

Check these files in order:
1. `DATABASE_SETUP.md` - Database issues
2. `README.md` - General usage and problems
3. `DEPLOYMENT.md` - Deployment issues

## 🎉 You're All Set!

Once you complete Step 1 (database setup), the app is fully functional and ready to use!

**Live Preview**: https://bookmark-hub-18.preview.emergentagent.com

---

**Built with Next.js 14, Supabase, and Tailwind CSS**

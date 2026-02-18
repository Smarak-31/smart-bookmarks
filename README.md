# Smart Bookmarks App

A real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS. Users can sign in with Google, save bookmarks, and see updates instantly across multiple tabs.

## 🚀 Features

- ✅ **Google OAuth Authentication** - Sign in with your Google account
- ✅ **Private Bookmarks** - Each user's bookmarks are completely private
- ✅ **Real-time Sync** - Bookmarks update instantly across all open tabs
- ✅ **CRUD Operations** - Add, view, and delete bookmarks
- ✅ **Beautiful UI** - Modern, responsive design with Tailwind CSS and shadcn/ui
- ✅ **Row Level Security** - Database-level privacy protection

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18
- **Authentication**: Supabase Auth with Google OAuth
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime subscriptions
- **Styling**: Tailwind CSS, shadcn/ui components
- **Deployment**: Vercel

## 📋 Setup Instructions

### Prerequisites

1. A Supabase account and project
2. Google OAuth credentials configured in Supabase
3. Node.js 18+ and yarn

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Database Setup

**IMPORTANT**: You must run the SQL commands in `DATABASE_SETUP.md` in your Supabase SQL Editor before using the app.

The setup includes:
1. Creating the `bookmarks` table
2. Setting up Row Level Security (RLS) policies
3. Enabling real-time subscriptions

See `DATABASE_SETUP.md` for detailed instructions.

### Installation

```bash
# Install dependencies
yarn install

# Run development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start
```

## 🌐 Deployment to Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Smart Bookmarks App"
git remote add origin https://github.com/yourusername/smart-bookmarks.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Click **"Deploy"**

### Step 3: Update Google OAuth Redirect URL

After deployment, add your Vercel URL to Google OAuth:

1. Go to Google Cloud Console
2. Navigate to your OAuth Client ID
3. Add to Authorized redirect URIs:
   ```
   https://your-project.vercel.app
   https://pcwyduojzmdcwbrktyhq.supabase.co/auth/v1/callback
   ```

### Step 4: Update Supabase Site URL

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Update **Site URL** to: `https://your-project.vercel.app`
3. Add to **Redirect URLs**: `https://your-project.vercel.app/**`

## 🧪 Testing

### Test Real-time Sync

1. Open the app in two browser tabs
2. Sign in with Google in both tabs
3. Add a bookmark in one tab
4. **Expected**: The bookmark appears instantly in the other tab
5. Delete a bookmark in one tab
6. **Expected**: It disappears from the other tab immediately

### Test Privacy

1. Sign in with Google Account A
2. Add some bookmarks
3. Sign out
4. Sign in with Google Account B
5. **Expected**: You should NOT see Account A's bookmarks

## 🐛 Problems I Ran Into & Solutions

### 1. Invalid Supabase URL Error

**Problem**: The initial Supabase URL provided had a typo/space in it, causing a "malformed URL" error.

**Solution**: Corrected the URL to match the proper format: `https://[project-ref].supabase.co` and restarted the Next.js server to reload environment variables.

### 2. Real-time Subscriptions Not Working

**Problem**: Bookmarks weren't syncing across tabs initially.

**Solution**: 
- Enabled the `supabase_realtime` publication for the bookmarks table in SQL
- Used proper channel subscriptions with postgres_changes event listeners
- Added filter to only listen to current user's bookmarks: `filter: user_id=eq.${user.id}`

### 3. Authentication Redirect Loop

**Problem**: After Google OAuth, the app could redirect infinitely if not configured properly.

**Solution**: 
- Set proper `redirectTo` in OAuth config: `window.location.origin`
- Configured Site URL in Supabase dashboard to match deployment URL
- Added proper redirect URIs in Google Cloud Console

### 4. Users Seeing Each Other's Bookmarks

**Problem**: Without proper security, any user could potentially access other users' data.

**Solution**: 
- Implemented Row Level Security (RLS) policies in Supabase
- Created policies for SELECT, INSERT, DELETE, and UPDATE that check `auth.uid() = user_id`
- This ensures database-level security, not just client-side filtering

### 5. Environment Variables Not Loading

**Problem**: After adding `.env.local`, Next.js wasn't picking up the new variables.

**Solution**: 
- Restarted the Next.js development server using `supervisorctl restart nextjs`
- Ensured environment variables are prefixed with `NEXT_PUBLIC_` for client-side access
- Verified `.env.local` is in the root directory and properly formatted

### 6. Stale Data After CRUD Operations

**Problem**: After adding/deleting bookmarks, the list wasn't updating correctly.

**Solution**:
- Instead of manually refreshing the list, relied on real-time subscriptions
- Real-time listeners handle INSERT and DELETE events automatically
- Used proper state management to update the bookmarks array

## 📁 Project Structure

```
/app
├── app/
│   ├── page.js              # Main app component
│   ├── layout.js            # Root layout
│   └── globals.css          # Global styles
├── lib/
│   └── supabase.js          # Supabase client configuration
├── components/ui/           # shadcn/ui components
├── .env.local               # Environment variables (not in git)
├── DATABASE_SETUP.md        # SQL setup instructions
└── README.md                # This file
```

## 🔐 Security Features

1. **Google OAuth Only** - No password management required
2. **Row Level Security** - Database enforces user isolation
3. **JWT Authentication** - Secure token-based auth via Supabase
4. **HTTPS Only** - All production traffic encrypted
5. **CORS Protection** - Proper origin validation

## 📝 API Routes

All authentication and database operations are handled by Supabase SDK:

- **Auth**: `supabase.auth.signInWithOAuth()` - Google OAuth
- **Get Bookmarks**: `supabase.from('bookmarks').select()`
- **Add Bookmark**: `supabase.from('bookmarks').insert()`
- **Delete Bookmark**: `supabase.from('bookmarks').delete().eq('id', id)`
- **Real-time**: `supabase.channel().on('postgres_changes', ...)`

## 🎨 UI Components Used

- Button, Input, Card (shadcn/ui)
- Lucide React icons
- Sonner toasts for notifications
- Custom gradient backgrounds
- Responsive design for mobile/desktop

## 📞 Support

If you encounter any issues:

1. Check `DATABASE_SETUP.md` - ensure all SQL commands were run
2. Verify environment variables are set correctly
3. Check Supabase dashboard for auth and database logs
4. Ensure Google OAuth is properly configured

## 📄 License

MIT

---

**Built with ❤️ using Next.js, Supabase, and Tailwind CSS**

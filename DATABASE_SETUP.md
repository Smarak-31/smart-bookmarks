# Database Setup Instructions

## Important: You need to run these SQL commands in your Supabase Dashboard

### Step 1: Go to SQL Editor
1. Open your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `pcwyduojzmdcwbrkthyq`
3. Click on **"SQL Editor"** in the left sidebar

### Step 2: Create the Bookmarks Table

Copy and paste this SQL command, then click **"Run"**:

```sql
-- Create bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS bookmarks_user_id_idx ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS bookmarks_created_at_idx ON public.bookmarks(created_at DESC);
```

### Step 3: Enable Row Level Security (RLS)

This ensures users can only see their own bookmarks:

```sql
-- Enable RLS
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view only their own bookmarks
CREATE POLICY "Users can view their own bookmarks"
  ON public.bookmarks
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own bookmarks
CREATE POLICY "Users can insert their own bookmarks"
  ON public.bookmarks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own bookmarks
CREATE POLICY "Users can delete their own bookmarks"
  ON public.bookmarks
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Users can update their own bookmarks
CREATE POLICY "Users can update their own bookmarks"
  ON public.bookmarks
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### Step 4: Enable Realtime

This makes bookmarks sync in real-time across tabs:

```sql
-- Enable realtime for bookmarks table
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookmarks;
```

### Step 5: Verify Setup

Run this query to check if everything is set up correctly:

```sql
-- Check if table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'bookmarks';

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'bookmarks';

-- Check policies
SELECT policyname, tablename 
FROM pg_policies 
WHERE tablename = 'bookmarks';
```

## ✅ Once Complete

After running all the SQL commands above, your database will be ready! The app will automatically:
- Allow users to sign in with Google
- Show only their own bookmarks
- Sync bookmarks in real-time across multiple tabs
- Prevent users from seeing each other's bookmarks

## 🔧 Troubleshooting

If you get errors:
1. Make sure you're running commands in the **SQL Editor** (not the Table Editor)
2. Run commands one section at a time
3. Check the Supabase logs if policies aren't working
4. Verify Google OAuth is enabled in Authentication → Providers

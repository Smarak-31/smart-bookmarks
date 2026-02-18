'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, Bookmark, LogOut, Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/sonner'

export default function Home() {
  const [user, setUser] = useState(null)
  const [bookmarks, setBookmarks] = useState([])
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Check user session on mount
  useEffect(() => {
    checkUser()

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null)
        if (session?.user) {
          fetchBookmarks()
        } else {
          setBookmarks([])
        }
      }
    )

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  // Fetch bookmarks and set up real-time subscription
  useEffect(() => {
    if (user) {
      fetchBookmarks()

      // Subscribe to real-time changes
      const channel = supabase
        .channel('bookmarks-channel')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookmarks',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Real-time update:', payload)
            if (payload.eventType === 'INSERT') {
              setBookmarks((prev) => [...prev, payload.new])
            } else if (payload.eventType === 'DELETE') {
              setBookmarks((prev) =>
                prev.filter((b) => b.id !== payload.old.id)
              )
            }
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [user])

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)
    } catch (error) {
      console.error('Error checking user:', error)
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    try {
      const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
      const currentOrigin = typeof window !== 'undefined' ? window.location.origin : ''
      
      console.log('=== OAuth Debug Info ===')
      console.log('Current URL:', currentUrl)
      console.log('Current Origin:', currentOrigin)
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://bookmark-hub-18.preview.emergentagent.com',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })
      
      console.log('OAuth Response:', data)
      if (error) {
        console.error('OAuth Error:', error)
        throw error
      }
    } catch (error) {
      console.error('Error signing in:', error)
      toast({
        title: 'Error',
        description: 'Failed to sign in with Google',
        variant: 'destructive'
      })
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setBookmarks([])
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully'
      })
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const fetchBookmarks = async () => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookmarks(data || [])
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch bookmarks',
        variant: 'destructive'
      })
    }
  }

  const addBookmark = async (e) => {
    e.preventDefault()
    if (!url.trim() || !title.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter both URL and title',
        variant: 'destructive'
      })
      return
    }

    try {
      const { error } = await supabase
        .from('bookmarks')
        .insert([{ url: url.trim(), title: title.trim(), user_id: user.id }])

      if (error) throw error

      setUrl('')
      setTitle('')
      toast({
        title: 'Success',
        description: 'Bookmark added successfully'
      })
    } catch (error) {
      console.error('Error adding bookmark:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to add bookmark',
        variant: 'destructive'
      })
    }
  }

  const deleteBookmark = async (id) => {
    try {
      const { error } = await supabase.from('bookmarks').delete().eq('id', id)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Bookmark deleted successfully'
      })
    } catch (error) {
      console.error('Error deleting bookmark:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete bookmark',
        variant: 'destructive'
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
              <Bookmark className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Smart Bookmarks
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Save and organize your favorite links with real-time sync
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={signInWithGoogle}
              className="w-full h-12 text-base font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Toaster />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
              <Bookmark className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Smart Bookmarks</h1>
              <p className="text-sm text-gray-600">Welcome, {user.email}</p>
            </div>
          </div>
          <Button
            onClick={signOut}
            variant="outline"
            className="gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>

        {/* Add Bookmark Form */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Bookmark
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={addBookmark} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Title (e.g., My Favorite Website)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-11"
                />
              </div>
              <div>
                <Input
                  type="url"
                  placeholder="URL (e.g., https://example.com)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="h-11"
                />
              </div>
              <Button type="submit" className="w-full h-11 text-base font-medium">
                <Plus className="w-4 h-4 mr-2" />
                Add Bookmark
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Bookmarks List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            My Bookmarks ({bookmarks.length})
          </h2>
          {bookmarks.length === 0 ? (
            <Card className="shadow-lg">
              <CardContent className="py-12 text-center">
                <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No bookmarks yet</p>
                <p className="text-gray-400 text-sm mt-2">
                  Add your first bookmark above to get started
                </p>
              </CardContent>
            </Card>
          ) : (
            bookmarks.map((bookmark) => (
              <Card
                key={bookmark.id}
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                      {bookmark.title}
                    </h3>
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline truncate block"
                    >
                      {bookmark.url}
                    </a>
                    <p className="text-xs text-gray-400 mt-2">
                      Added {new Date(bookmark.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    onClick={() => deleteBookmark(bookmark.id)}
                    variant="ghost"
                    size="icon"
                    className="ml-4 text-gray-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

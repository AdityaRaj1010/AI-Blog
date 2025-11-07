'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import Button from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { useAuth } from '@/lib/supabase/provider'
import LoadingSpinner from '@/components/ui/loading-spinner'

export default function DashboardPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  type BlogPost = {
    id: string;
    title: string;
    slug: string;
    created_at: string;
    keywords?: string[] | undefined;
    profile?: {
        username: string;
    } | undefined;
  }

  useEffect(() => {
    if (!user) return
    
    const fetchPosts = async () => {
      try {
        setLoading(true)
        
        // First get all posts by this user
        const { data: userPosts, error: postsError } = await supabase
          .from('posts')
          .select('id, title, created_at, slug, keywords, user_id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        
        if (postsError) throw postsError
        
        // Then get all usernames for these posts
        const userIds = userPosts.map(post => post.user_id)
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('user_id, username')
          .in('user_id', userIds)
        
        if (profilesError) throw profilesError
        
        // Combine posts with usernames
        const postsWithUsernames = userPosts.map(post => ({
          ...post,
          profile: profilesData.find(profile => profile.user_id === post.user_id)
        }))
        
        setPosts(postsWithUsernames)
      } catch (err: unknown) {
        let message = "An unknown Error occured";
        if(err instanceof Error){
          message = err.message;
        }
        setError(message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPosts()
  }, [user])

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user?.id) // Ensure only owner can delete

      if (error) throw error
      setPosts(posts.filter(post => post.id !== postId))
    } catch (err: unknown) {
      let message = "An unknown Error occured";
      if(err instanceof Error){
        message = err.message;
      }
      setError(message)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-indigo-900/50 border-b border-white/10">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                My Posts
              </h1>
              <p className="text-gray-400">Manage and organize your content</p>
            </div>
            
            <Link href="/dashboard/new">
              <Button variant="primary" className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60">
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create New Post
                </span>
              </Button>
            </Link>
          </div>
          
          {/* Stats Bar */}
          {!loading && !error && posts.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{posts.length}</p>
                    <p className="text-sm text-gray-400">Total Posts</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{posts[0]?.profile?.username || 'You'}</p>
                    <p className="text-sm text-gray-400">Author</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">Active</p>
                    <p className="text-sm text-gray-400">Status</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <LoadingSpinner className="mb-4" />
            <p className="text-gray-400">Loading your posts...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 backdrop-blur-sm rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-500 mb-1">Error loading posts</h3>
                <p className="text-gray-400">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No posts yet</h3>
              <p className="text-gray-400 mb-8">Create your first post to get started on your blogging journey</p>
              <Link href="/dashboard/new">
                <Button variant="primary" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/50">
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create First Post
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        )}
        
        {!loading && !error && posts.length > 0 && (
          <div className="space-y-4">
            {posts.map((post, index) => (
              <div
                key={post.id}
                className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 overflow-hidden hover:shadow-xl hover:shadow-purple-500/10"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/10 group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors truncate">
                            {post.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                              <span>{post.profile?.username || 'User'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{formatDate(post.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 lg:flex-shrink-0">
                      <Link href={`/blog/${post.slug}`}>
                        <Button variant="outline" size="sm" className="border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all">
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                          </span>
                        </Button>
                      </Link>
                      <Link href={`/dashboard/${post.id}`}>
                        <Button variant="outline" size="sm" className="border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all">
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </span>
                        </Button>
                      </Link>
                      <Button
                        onClick={() => handleDelete(post.id)}
                        variant="destructive"
                        size="sm"
                        className="border-red-500/20 hover:border-red-500/50 hover:bg-red-500/20 transition-all"
                      >
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import BlogCard from '@/components/blog-card'
import { useAuth } from '@/lib/supabase/provider'
import LoadingSpinner from '@/components/ui/loading-spinner'

export default function SavedPostsPage() {
  const { user } = useAuth()
  const [savedPosts, setSavedPosts] = useState<BlogPost[]>([])
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

    const fetchSavedPosts = async () => {
      setLoading(true)
      try {
        // First get saved post IDs
        const { data: savedData, error: savedError } = await supabase
          .from('saved_posts')
          .select('post_id')
          .eq('user_id', user.id)
        
        if (savedError) throw savedError
        
        const postIds = savedData.map(item => item.post_id)
        
        if (postIds.length === 0) {
          setSavedPosts([])
          return
        }
        
        // Then get the posts
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('id, title, slug, created_at, keywords, user_id')
          .in('id', postIds)
        
        if (postsError) throw postsError
        
        // Then get profiles
        const userIds = postsData.map(post => post.user_id).filter(Boolean)
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, username')
          .in('user_id', userIds)
        
        // Combine data
        const postsWithUsernames = postsData.map(post => ({
          ...post,
          profile: profiles?.find(profile => profile.user_id === post.user_id)
        }))
        
        setSavedPosts(postsWithUsernames)
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

    fetchSavedPosts()
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Your Saved Posts</h1>
      
      {loading && <LoadingSpinner className="my-8" />}
      {error && <p className="text-red-500">{error}</p>}
      
      {!loading && !error && savedPosts.length === 0 && (
        <div className="text-center py-12">
          <p>You haven&apos;t saved any posts yet.</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedPosts.map(post => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
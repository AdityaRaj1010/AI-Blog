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
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      } catch (err: any) {
        setError(err.message)
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
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Posts</h1>
        <Link href="/dashboard/new">
          <Button variant="primary">
            Create New Post
          </Button>
        </Link>
      </div>

      {loading && <LoadingSpinner className="my-8" />}
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          <p>Error loading posts: {error}</p>
        </div>
      )}
      
      {!loading && !error && posts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No posts yet</h3>
          <p className="text-gray-600 mb-6">Create your first post to get started</p>
          <Link href="/dashboard/new">
            <Button variant="primary">
              Create First Post
            </Button>
          </Link>
        </div>
      )}
      
      {!loading && !error && posts.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="from-blue-900 to-purple-900">
              <tr>
                <th className="text-left py-3 px-4">Title</th>
                <th className="text-left py-3 px-4">Author</th>
                <th className="text-left py-3 px-4">Created</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} className="border-t hover:bg-gray-900">
                  <td className="py-3 px-4">{post.title}</td>
                  <td className="py-3 px-4">{post.profile?.username || 'User'}</td>
                  <td className="py-3 px-4">{formatDate(post.created_at)}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Link href={`/blog/${post.slug}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                      <Link href={`/dashboard/${post.id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        onClick={() => handleDelete(post.id)}
                        variant="destructive"
                        size="sm"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
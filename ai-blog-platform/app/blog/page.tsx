import { supabase } from '@/lib/supabase/client'
import BlogCard from '@/components/blog-card'
import { formatDate } from '@/lib/utils'

export default async function BlogPage() {
  // First get all posts
  const { data: posts, error: postsError } = await supabase
    .from('posts')
    .select('id, title, slug, created_at, keywords, user_id')
    .order('created_at', { ascending: false })
  
  if (postsError) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <h1 className="text-2xl font-bold">Error Loading Posts</h1>
        <p>{postsError.message}</p>
      </div>
    )
  }

  // Then get all usernames
  const userIds = posts.map(post => post.user_id)
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('user_id, username')
    .in('user_id', userIds)
  
  // Combine posts with usernames
  const postsWithUsernames = posts.map(post => ({
    ...post,
    profile: profiles?.find(profile => profile.user_id === post.user_id)
  }))

  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">All Blog Posts</h1>
      
      {postsWithUsernames.length > 0 ? (
        <div className="space-y-8">
          {postsWithUsernames.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p>No posts found. Create your first post!</p>
      )}
    </div>
  )
}
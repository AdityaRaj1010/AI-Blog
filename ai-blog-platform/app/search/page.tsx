import { supabase } from '@/lib/supabase/client'
import BlogCard from '@/components/blog-card'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const query = (await searchParams).q?.trim() || ''
  
  if (!query) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8">Search Blogs</h1>
        <p>Enter a search term to find blog posts</p>
      </div>
    )
  }

  try {
    // First get matching posts
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id, title, slug, created_at, keywords, user_id')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    
    if (postsError) throw postsError
    
    // Then get profiles
    const userIds = posts.map(post => post.user_id).filter(Boolean)
    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, username')
      .in('user_id', userIds)
    
    // Combine data
    const postsWithUsernames = posts.map(post => ({
      ...post,
      profile: profiles?.find(profile => profile.user_id === post.user_id)
    }))

    return (
      <div className="max-w-4xl mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8">
          Search Results for &quot;{query}&quot;
        </h1>
        
        {postsWithUsernames.length === 0 && (
          <div className="text-center py-12">
            <p>No posts found matching your search.</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {postsWithUsernames.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    )
  } catch (error: unknown) {
    let message = "An unknown Error occured";
    if(error instanceof Error){
      message = error.message;
    }
    return (
      <div className="max-w-4xl mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8">Error</h1>
        <p>{message}</p>
      </div>
    )
  }
}
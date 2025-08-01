import { supabase } from '@/lib/supabase/client'
import BlogCard from '@/components/blog-card'

export default async function Home() {
  try {
    // First get all posts
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id, title, slug, created_at, keywords, user_id')
      .order('created_at', { ascending: false })
      .limit(6)
    
    if (postsError) throw postsError
    if (!posts || posts.length === 0) return <p>No posts found</p>

    // Then get all usernames for these posts
    const userIds = posts.map(post => post.user_id).filter(Boolean)
    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, username')
      .in('user_id', userIds)
    
    // Combine posts with usernames
    const postsWithUsernames = posts.map(post => ({
      ...post,
      profile: profiles?.find(profile => profile.user_id === post.user_id)
    }))

    return (
      <div>
        <section className="mb-16 text-center py-12 bg-gradient-to-t from-purple-900 to-blue-900">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            AI-Powered Blogging
          </h1>
          <p className="text-xl text-black max-w-2xl mx-auto">
            Create SEO-optimized content with AI assistance. Free and open-source.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Latest Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postsWithUsernames.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      </div>
    )
  } catch (error: unknown) {
    let message = "An unknown Error occured";
    if(error instanceof Error){
      message = error.message;
    }
    return (
      <div className="max-w-3xl mx-auto py-12">
        <h1 className="text-2xl font-bold">Error Loading Posts</h1>
        <p>{message}</p>
      </div>
    )
  }
}
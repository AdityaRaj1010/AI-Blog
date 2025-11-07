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
    if (!posts || posts.length === 0) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-lg text-gray-400">No posts found</p>
          </div>
        </div>
      )
    }

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
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-20 md:py-32">
          {/* Decorative background elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
          </div>
          
          <div className="relative max-w-6xl mx-auto px-4 text-center">
            <div className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-sm font-medium text-white">Free & Open Source</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-purple-100">
              AI-Powered Blogging
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-10 leading-relaxed">
              Create SEO-optimized content with AI assistance. Elevate your writing with cutting-edge technology.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-white">SEO Optimized</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-white">AI Assisted</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-white">Free Forever</span>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Posts Section */}
        <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                Latest Posts
              </h2>
              <p className="text-gray-400 mt-2">Discover fresh content from our community</p>
            </div>
            
            <div className="hidden md:block">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>{posts.length} new posts</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-500 mb-2">Error Loading Posts</h1>
          <p className="text-gray-400">{message}</p>
        </div>
      </div>
    )
  }
}
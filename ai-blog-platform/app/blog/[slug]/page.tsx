// app/blog/[slug]/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import BlogContent from '@/components/blog-content'
import PostInteractions from '@/components/post-interactions'

export const dynamic = 'force-dynamic'

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  // Get slug from params
  const { slug } = await params;
  const normalizedSlug = slug.toLowerCase();

  // Create Supabase client with cookies
  const cookieStore = await cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  try {
    // First get the post without the profile relationship
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', normalizedSlug)
      .single();

    if (postError) throw postError;
    if (!post) throw new Error('Post not found');

    // Then get the profile for this post's user_id
    let username = 'User';
    if (post.user_id) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('username')
        .eq('user_id', post.user_id)
        .single();

      if (!profileError && profile) {
        username = profile.username;
      }
    }

    return (
      <article className="max-w-3xl mx-auto py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-bold">{post.title}</h1>
          <div className="flex items-center mt-4 text-gray-600">
            <span className="font-medium">{username}</span>
            <span className="mx-2">•</span>
            <span>
              {new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="mx-2">•</span>
            <div className="flex gap-2">
              {post.keywords?.map((tag: string) => (
                <span 
                  key={tag} 
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        <BlogContent content={post.content} />
        <PostInteractions postId={post.id} />
      </article>
    );
  } catch (error: any) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <h1 className="text-2xl font-bold">Error</h1>
        <p className="mt-4">{error.message}</p>
      </div>
    );
  }
}
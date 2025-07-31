import Link from 'next/link'
import { formatDate } from '@/lib/utils'

type BlogCardProps = {
  post: {
    id: string
    title: string
    slug: string
    created_at: string
    keywords?: string[]
    profile?: {
      username: string
    }
  }
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden bg-gradient-to-t from-blue-900 to-purple-900 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/blog/${post.slug}`}>
            <h3 className="text-xl font-bold line-clamp-2 hover:text-primary transition-colors">
              {post.title}
            </h3>
          </Link>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-sm text-black">
            <span className="font-medium">
              {post.profile?.username || 'User'}
            </span>
            <span className="mx-2">•</span>
            <span>{formatDate(post.created_at)}</span>
          </div>
        </div>
        
        {post.keywords && post.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.keywords.slice(0, 3).map(tag => (
              <span 
                key={tag} 
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <Link href={`/blog/${post.slug}`}>
            <button className="text-primary hover:underline">
              Read More →
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
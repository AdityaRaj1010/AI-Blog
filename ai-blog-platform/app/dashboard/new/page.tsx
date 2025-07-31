'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { generateSlug, generateId } from '@/lib/utils' // Add generateId
import AIEditor from '@/components/editor/AIEditor'
import SEOAnalyzer from '@/components/seo-analyzer'
import Button from '@/components/ui/button'

export default function NewPostPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [seoData, setSeoData] = useState<any>(null)
  const [keywords, setKeywords] = useState<string[]>([])

  const handleContentChange = (html: string) => {
    setContent(html)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      if (!title || !content) {
        throw new Error('Title and content are required')
      }
      
      const slug = generateSlug(title)
      const id = generateId() // Generate a unique ID
      
      const { error } = await supabase
        .from('posts')
        .insert([{
          id,
          title,
          content,
          slug,
          keywords,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
      
      if (error) throw error
      router.push(`/blog/${slug}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="title" className="block text-gray-700 mb-2">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-xl"
            placeholder="Your blog post title"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">
            Content
          </label>
          <AIEditor 
            onContentChange={handleContentChange} 
          />
        </div>
        
        <SEOAnalyzer 
          content={content} 
          onAnalysisComplete={setSeoData} 
          onKeywordsChange={setKeywords}
        />
        
        <div className="mt-8">
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={!content}
            variant="primary"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Post'}
          </Button>
        </div>
      </form>
    </div>
  )
}
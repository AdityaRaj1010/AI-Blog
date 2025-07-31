'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation' // Import useParams
import { supabase } from '@/lib/supabase/client'
import { generateSlug } from '@/lib/utils'
import AIEditor from '@/components/editor/AIEditor'
import SEOAnalyzer from '@/components/seo-analyzer'
import Button from '@/components/ui/button'

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams() // Use the useParams hook
  const [post, setPost] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [seoData, setSeoData] = useState<any>(null)
  const [keywords, setKeywords] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  // Get the id from params
  const id = Array.isArray(params.id) ? params.id[0] : params.id

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id) // Use the id from useParams
          .single()
        
        if (error) throw error
        
        setPost(data)
        setTitle(data.title)
        setContent(data.content)
        setKeywords(data.keywords || [])
      } catch (err: any) {
        setError(err.message)
      }
    }
    
    if (id) {
      fetchPost()
    }
  }, [id]) // Depend on id

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
      const { error } = await supabase
        .from('posts')
        .update({
          title,
          content,
          slug,
          keywords,
          updated_at: new Date().toISOString()
        })
        .eq('id', id) // Use the id from useParams
      
      if (error) throw error
      router.push(`/blog/${slug}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!post && !error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading post...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <h1 className="text-2xl font-bold">Error</h1>
        <p className="mt-4">{error}</p>
        <Button 
          onClick={() => router.push('/dashboard')}
          className="mt-4"
        >
          Back to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
      
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
            initialContent={content}
            onContentChange={handleContentChange} 
          />
        </div>
        
        <SEOAnalyzer 
          content={content} 
          onAnalysisComplete={setSeoData} 
          onKeywordsChange={setKeywords}
          initialKeywords={keywords}
        />
        
        <div className="mt-8 flex gap-4">
          <Button
            type="submit"
            loading={isSubmitting}
            variant="primary"
          >
            Update Post
          </Button>
          
          <Button
            type="button"
            onClick={() => router.push(`/blog/${post.slug}`)}
            variant="outline"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
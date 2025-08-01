'use client'

import { useState, useEffect } from 'react'

type SEOData = {
  keywords: string[]
  readability: number
  metaDescription: string
  wordCount: number
}

type SEOAnalyzerProps = {
  content: string
  onAnalysisComplete: (data: SEOData) => void
  onKeywordsChange: (keywords: string[]) => void
  initialKeywords?: string[]
}

export default function SEOAnalyzer({ 
  content, 
  onAnalysisComplete,
  onKeywordsChange,
  initialKeywords = []
}: SEOAnalyzerProps) {
  const [keywords, setKeywords] = useState<string[]>(initialKeywords)
  const [seoData, setSeoData] = useState<SEOData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (content && content.length > 100) {
      analyzeSEO()
    }
  }, [content])

  const analyzeSEO = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      })
      
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'SEO analysis failed')
      
      setSeoData(data)
      onAnalysisComplete(data)
      onKeywordsChange(data.keywords || [])
    } catch (err: unknown) {
      let message = "An unknown Error occured";
      if(err instanceof Error){
        message = err.message;
      }
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!content || content.length < 100) {
    return null
  }

  return (
    <div className="mb-6 p-4 rounded-lg">
      <h3 className="font-bold mb-2">SEO Analysis</h3>
      
      {isLoading && <p>Analyzing content...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {seoData && !isLoading && !error && (
        <div className="space-y-2">
          <p><strong>Keywords:</strong> {seoData.keywords?.join(', ')}</p>
          <p><strong>Readability:</strong> {seoData.readability?.toFixed(1)} (Good: 60+)</p>
          <p><strong>Word Count:</strong> {seoData.wordCount}</p>
          <p><strong>Suggested Description:</strong> {seoData.metaDescription}</p>
        </div>
      )}
    </div>
  )
}
import { NextResponse } from 'next/server'
import * as natural from 'natural'
// import * as textstat from 'textstat'
import textReadability from 'text-readability';

export async function POST(req: Request) {
  const { content } = await req.json()
  
  try {
    // Removing HTML tags for text analysis
    const cleanContent = content.replace(/<[^>]*>/g, ' ')
    
    // Keyword extraction
    const tokenizer = new natural.WordTokenizer()
    const tokens = tokenizer.tokenize(cleanContent) || []
    
    // TF-IDF implementation
    const tfidf = new natural.TfIdf()
    tfidf.addDocument(cleanContent)
    
    const keywords: string[] = []
    tfidf.listTerms(0).forEach(item => {
      if (item.tfidf > 0.3 && item.term.length > 4) {
        keywords.push(item.term)
      }
    })
    
    // Readability score
    const readability = textReadability.fleschReadingEase(cleanContent)
    
    // Suggested meta description
    const sentences = cleanContent.split(/[.!?]/)
    const metaDescription = sentences[0]?.substring(0, 160) + '...'
    
    // Word count
    const wordCount = tokens.length
    
    return NextResponse.json({
      keywords: keywords.slice(0, 5),
      readability,
      metaDescription,
      wordCount
    })
    
  } catch (error) {
    console.error('SEO Analysis Error:', error)
    return NextResponse.json(
      { error: 'SEO analysis failed' },
      { status: 500 }
    )
  }
}
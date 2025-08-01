import { NextResponse } from 'next/server'
import textReadability from 'text-readability'

export async function POST(req: Request) {
  const { content } = await req.json()

  try {
    // Remove HTML tags
    const cleanContent = content.replace(/<[^>]*>/g, ' ').toLowerCase()

    // Tokenize (remove punctuation, split on spaces)
    const tokens = cleanContent
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(Boolean)

    // Word frequency count
    const wordFreq = new Map<string, number>()
    for (const token of tokens) {
      if (token.length < 4) continue // skip very short words
      wordFreq.set(token, (wordFreq.get(token) || 0) + 1)
    }

    // Sort by frequency
    const sorted = [...wordFreq.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([word]) => word)

    // Use top 5 as keywords
    const keywords = sorted.slice(0, 5)

    // Readability score
    const readability = textReadability.fleschReadingEase(cleanContent)

    // Suggested meta description (first sentence)
    const sentences = cleanContent.split(/[.!?]/)
    const metaDescription = sentences[0]?.substring(0, 160).trim() + '...'

    // Word count
    const wordCount = tokens.length

    return NextResponse.json({
      keywords,
      readability,
      metaDescription,
      wordCount,
    })
  } catch (error) {
    console.error('SEO Analysis Error:', error)
    return NextResponse.json(
      { error: 'SEO analysis failed' },
      { status: 500 }
    )
  }
}

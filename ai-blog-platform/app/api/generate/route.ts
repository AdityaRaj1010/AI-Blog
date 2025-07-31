import { NextResponse } from 'next/server'
import { markdownToHtml } from '@/lib/utils';

export async function POST(req: Request) {
  const { prompt } = await req.json()
  const OR_TOKEN = process.env.OPENROUTER_API_KEY!

  // Debug Log 1 - Check token and prompt
  console.log("[DEBUG] Prompt received:", prompt)
  console.log("[DEBUG] OR Token exists?", !!OR_TOKEN)
  if (!OR_TOKEN) {
    return NextResponse.json({ error: "OpenRouter API Key missing" }, { status: 500 })
  }

  try {
    // Debug Log 2 - Start fetch
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions", // or any free model
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OR_TOKEN}`,
          "Content-Type": "application/json",
          // "HTTP-Referer": "http://localhost:3000",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat-v3-0324:free",
          messages: [
            {
              role: "system",
              content: "You are a professional blog writer. Generate detailed, SEO-friendly blog content using HTML tags ONLY. Use <h3> for headings, <p> for paragraphs, and <ul>/<li> for lists. DO NOT USE MARKDOWN SYNTAX like #, *, -.",
            },
            {
              role: "user",
              content: `Write a comprehensive blog post in HTML format about: ${prompt}. Use only HTML tags, no Markdown.`,
            },
          ],
          max_new_tokens: 500,
          temperature: 0.7,
        }),
      }
    );

    // Debug Log 3 - If model is loading
    if (response.status === 503) {
      const data = await response.json()
      const estimatedTime = data.estimated_time || 30
      console.log(`[DEBUG] Model loading, waiting ${estimatedTime} seconds...`)
      await new Promise(resolve => setTimeout(resolve, estimatedTime * 1000))
      return await POST(req)
    }

    // Debug Log 4 - If API error
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[DEBUG] API Error: ${response.status} - ${errorText}`)
      throw new Error(`API error: ${response.status} ${errorText}`)
    }

    // Debug Log 5 - Successful response
    const data = await response.json()
    console.log("[DEBUG] OR Response data:", data)

    const generatedText = data.choices[0]?.message?.content || ''
    const formattedContent = markdownToHtml(generatedText)
      .split('\n\n')
      .map(para => `<p>${para}</p>`)
      .join('')

    return NextResponse.json({ content: formattedContent })

  } catch (error: any) {
    console.error('[DEBUG] AI Generation Error:', error)

    const localFallback = `<p>${prompt} is a fascinating topic. This is placeholder content since the AI model is not available.</p>
                           <p>In a real application, this would be AI-generated text about ${prompt}.</p>`

    return NextResponse.json({ content: localFallback })
  }
}

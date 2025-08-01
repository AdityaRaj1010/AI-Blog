'use client'

import { useState, useCallback, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TipTapMenu from './TipTapMenu'
import { generateContent } from '@/lib/ai/generate'

type AIEditorProps = {
  initialContent?: string
  onContentChange?: (content: string) => void
}

export default function AIEditor({
  initialContent,
  onContentChange
}: AIEditorProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationPrompt, setGenerationPrompt] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: true,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: true,
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your blog post...',
      }),
    ],
    content: initialContent || '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (onContentChange) {
        onContentChange(editor.getHTML())
      }
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleAIGenerate = useCallback(async () => {
    if (!editor) return
    setIsGenerating(true)

    try {
      const generatedContent = await generateContent(
        generationPrompt || 'blog post about technology trends'
      )
      if (editor.isEmpty) {
        editor.commands.clearContent()
      }

      const doc = new DOMParser().parseFromString(editor.getHTML(), 'text/html');
      const errorElements = doc.querySelectorAll('.text-red-500, .bg-yellow-50');
      errorElements.forEach(el => el.remove());

      editor.commands.insertContent(generatedContent)

      // // Preserve cursor position
      // const { from } = editor.state.selection
      
      // // Insert content at cursor position
      // editor.commands.insertContentAt(from, generatedContent)
      
      // // Move cursor to end of inserted content
      // editor.commands.setTextSelection(from + generatedContent.length)

      setGenerationPrompt('')
    } catch (error: unknown) {
      let message = "An unknown Error occured";
      if(error instanceof Error){
        message = error.message;
      }
      console.error('Generation failed:', error)
      editor.commands.insertContent(
        `<p class="text-red-500">${message}</p>`
      )
    } finally {
      setIsGenerating(false)
    }
  }, [editor, generationPrompt])

  if (!isMounted || !editor) {
    return <div className="min-h-[400px] border rounded-lg bg-green-500 p-4">Loading editor...</div>
  }

  return (
    <div className="border rounded-lg">
      <TipTapMenu
        editor={editor}
        onAIGenerate={handleAIGenerate}
        isGenerating={isGenerating}
      />

      <div className="p-4 border-t">
        <input
          type="text"
          value={generationPrompt}
          onChange={(e) => setGenerationPrompt(e.target.value)}
          placeholder="What should the AI write about?"
          className="w-full mb-4 px-3 py-2 border rounded-md"
          disabled={isGenerating}
        />
      </div>

      <EditorContent
        editor={editor}
        className="min-h-[400px] p-4 focus:outline-none prose max-w-none dark:prose-invert"
      />
    </div>
  )
}
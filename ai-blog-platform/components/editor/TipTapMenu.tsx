'use client'

import { Editor } from '@tiptap/react'

type TipTapMenuProps = {
  editor: Editor | null
  onAIGenerate: () => void
  isGenerating: boolean
}

export default function TipTapMenu({ 
  editor, 
  onAIGenerate, 
  isGenerating 
}: TipTapMenuProps) {
  if (!editor) {
    return null
  }

  const menuItems = [
  {
    icon: 'format_bold',
    action: () => editor.chain().focus().toggleBold().run(),
    isActive: editor.isActive('bold'),
  },
  {
    icon: 'format_italic',
    action: () => editor.chain().focus().toggleItalic().run(),
    isActive: editor.isActive('italic'),
  },
  {
    icon: 'title', // or 'text_fields'
    action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: editor.isActive('heading', { level: 1 }),
  },
  {
      icon: 'format_list_bulleted',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
      title: 'Bullet List'
    },
    {
      icon: 'format_list_numbered',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
      title: 'Numbered List'
    },
    {
      icon: 'code',
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: editor.isActive('codeBlock'),
      title: 'Code Block'
    },
    {
      icon: 'horizontal_rule',
      action: () => editor.chain().focus().setHorizontalRule().run(),
      isActive: false,
      title: 'Horizontal Rule'
    },
    {
      icon: 'undo',
      action: () => editor.chain().focus().undo().run(),
      isActive: false,
      title: 'Undo'
    },
    {
      icon: 'redo',
      action: () => editor.chain().focus().redo().run(),
      isActive: false,
      title: 'Redo'
    }
]



  return (
    <div className="flex items-center p-2 border-b flex-wrap gap-2">
      <div className="flex gap-1">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className={`p-2 rounded ${
              item.isActive ? 'bg-cyan-800' : 'hover:bg-pink-800'
            }`}
            title={item.icon.replace('-', ' ')}
          >
            <span className="material-icons">{item.icon}</span>
          </button>
        ))}
      </div>

      <div className="ml-auto">
        <button
          onClick={onAIGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-blue-500 text-primary px-4 py-2 rounded-md hover:bg-blue-900 disabled:opacity-50"
        >
          <span className="material-icons">auto_awesome</span>
          {isGenerating ? 'Generating...' : 'AI Generate'}
        </button>
      </div>
    </div>
  )
}
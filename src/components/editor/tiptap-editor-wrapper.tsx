import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import { Markdown } from '@tiptap/markdown'
import TiptapToolbar from './tiptap-toolbar'
import { useEffect, useState } from 'react'

interface TiptapEditorWrapperProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  maxLength?: number
  outputFormat?: 'html' | 'markdown'
}

export default function TiptapEditorWrapper({
  value,
  onChange,
  placeholder = 'Write your review here...',
  disabled = false,
  maxLength = 10000,
  outputFormat = 'markdown',
}: TiptapEditorWrapperProps) {
  const [counts, setCounts] = useState({ characters: 0, words: 0 })

  const syncCounts = (editorInstance: {
    storage?: {
      characterCount?: {
        characters: () => number
        words: () => number
      }
    }
  }) => {
    const characterCountExtension = editorInstance.storage?.characterCount
    setCounts({
      characters: characterCountExtension?.characters() ?? 0,
      words: characterCountExtension?.words() ?? 0,
    })
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-accent-blue hover:underline cursor-pointer',
        },
      }),
      Underline,
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount.configure({
        limit: maxLength,
      }),
      Markdown.configure({
        markedOptions: {
          gfm: true,
        },
      }),
    ],
    content: value,
    contentType: 'markdown',
    editable: !disabled,
    editorProps: {
      attributes: {
        class:
          'prose prose-invert max-w-none focus:outline-none min-h-[300px] px-4 py-3 text-near-white [&>p]:mb-3 [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:mb-3 [&>h3]:text-lg [&>h3]:font-medium [&>h3]:mb-2 [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>blockquote]:border-l-4 [&>blockquote]:border-frost [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-muted-text [&>a]:text-accent-blue [&>a]:hover:underline [&>ul>li]:my-1 [&>ol>li]:my-1 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0',
      },
    },
    onUpdate: ({ editor }) => {
      const output =
        outputFormat === 'markdown' ? editor.getMarkdown() : editor.getHTML()
      onChange(output)
      syncCounts(editor)
    },
    onCreate: ({ editor }) => {
      syncCounts(editor)
    },
    onTransaction: ({ editor }) => {
      syncCounts(editor)
    },
  })

  useEffect(() => {
    if (editor && value !== undefined && value !== null) {
      const currentMarkdown = editor.getMarkdown()
      if (value !== currentMarkdown) {
        editor.commands.setContent(value, {
          contentType: 'markdown',
          emitUpdate: false,
        })
        syncCounts(editor)
      }
    }
  }, [value, editor])

  const characterCount = counts.characters
  const wordCount = counts.words

  return (
    <div className="bg-surface-2 border border-frost rounded-lg overflow-hidden">
      {!disabled && <TiptapToolbar editor={editor} />}
      <EditorContent editor={editor} />
      <div className="flex items-center justify-between px-4 py-2 bg-surface-2 border-t border-frost text-xs text-muted-text">
        <div className="flex gap-4">
          <span>{wordCount} từ</span>
          <span>{characterCount} ký tự</span>
        </div>
        {maxLength && (
          <span className={characterCount > maxLength ? 'text-accent-red' : ''}>
            {characterCount} / {maxLength}
          </span>
        )}
      </div>
    </div>
  )
}

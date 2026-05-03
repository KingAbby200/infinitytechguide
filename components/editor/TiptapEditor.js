'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ImageExtension from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import { Extension } from '@tiptap/core'
import EditorToolbar from './EditorToolbar'
import ImageInsertMenu from './ImageInsertMenu'
import { useState } from 'react'

// Custom Image extension with width, align, borderRadius attributes
const CustomImage = ImageExtension.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '100%',
        parseHTML: el => el.style.width || el.getAttribute('width') || '100%',
        renderHTML: attrs => ({ style: `width:${attrs.width}` }),
      },
      align: {
        default: 'none',
        parseHTML: el => el.getAttribute('data-align') || 'none',
        renderHTML: attrs => ({
          'data-align': attrs.align,
          style:
            attrs.align === 'center'
              ? 'display:block;margin-left:auto;margin-right:auto'
              : attrs.align === 'right'
              ? 'display:block;margin-left:auto'
              : '',
        }),
      },
      borderRadius: {
        default: '8px',
        parseHTML: el => el.style.borderRadius || '8px',
        renderHTML: attrs => ({ style: `border-radius:${attrs.borderRadius}` }),
      },
      alt: { default: '' },
    }
  },
})

// FontSize extension via inline style
const FontSize = Extension.create({
  name: 'fontSize',
  addGlobalAttributes() {
    return [{
      types: ['textStyle'],
      attributes: {
        fontSize: {
          default: null,
          parseHTML: el => el.style.fontSize || null,
          renderHTML: attrs => {
            if (!attrs.fontSize) return {}
            return { style: `font-size:${attrs.fontSize}` }
          },
        },
      },
    }]
  },
})

export default function TiptapEditor({ content = '', onChange, placeholder = 'Write your post here…' }) {
  const [showImageMenu, setShowImageMenu] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      CustomImage.configure({ inline: false, allowBase64: false }),
      Link.configure({
        openOnClick:     false,
        HTMLAttributes:  { class: 'text-primary underline underline-offset-2', target: '_blank', rel: 'noopener noreferrer' },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph', 'image'] }),
      Underline,
      TextStyle,
      Color,
      FontSize,
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'tiptap-content min-h-[500px] focus:outline-none p-6',
      },
    },
  })

  function insertImage({ src, alt, width, align, borderRadius }) {
    if (!editor || !src) return
    editor.chain().focus().setImage({ src, alt, width, align, borderRadius }).run()
    setShowImageMenu(false)
  }

  return (
    <div className="border border-dark-border rounded-xl overflow-hidden bg-dark">
      <EditorToolbar editor={editor} onInsertImage={() => setShowImageMenu(true)} />

      <div className="relative">
        <EditorContent editor={editor} />
      </div>

      {showImageMenu && (
        <ImageInsertMenu
          onInsert={insertImage}
          onClose={() => setShowImageMenu(false)}
        />
      )}
    </div>
  )
}
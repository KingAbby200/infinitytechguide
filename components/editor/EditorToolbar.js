'use client'
import { useState } from 'react'
import {
  Bold,
  Italic,
  Code,
  Underline,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Image,
  Link as LinkIcon,
  LinkOff,
  Minus,
  Undo,
  Redo,
  Strikethrough,
} from 'lucide-react'

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px']
const HEADINGS = [1, 2, 3, 4]

function ToolBtn({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault()
        onClick?.()
      }}
      disabled={disabled}
      title={title}
      className={`w-8 h-8 flex items-center justify-center rounded text-sm transition-all ${
        active
          ? 'bg-primary text-black'
          : 'text-gray-400 hover:text-white hover:bg-white/8'
      } disabled:opacity-30 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="w-px h-5 bg-dark-border mx-0.5 flex-shrink-0" />
}

export default function EditorToolbar({ editor, onInsertImage }) {
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')

  if (!editor) return null

  // Improved Link Handler
  function setLink() {
    if (!linkUrl) {
      editor.chain().focus().unsetLink().run()
      setShowLinkInput(false)
      return
    }

    const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`

    // Better way to handle link + optional text
    if (linkText && editor.state.selection.empty) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'text',
          text: linkText,
          marks: [{ type: 'link', attrs: { href: url } }],
        })
        .run()
    } else {
      editor.chain().focus().setLink({ href: url }).run()
    }

    setLinkUrl('')
    setLinkText('')
    setShowLinkInput(false)
  }

  function setFontSize(size) {
    editor.chain().focus().setMark('textStyle', { fontSize: size }).run()
  }

  return (
    <div className="border-b border-dark-border bg-dark-card">
      <div className="flex flex-wrap items-center gap-0.5 p-2">
        {/* Undo / Redo */}
        <ToolBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
          <Undo size={18} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
          <Redo size={18} />
        </ToolBtn>

        <Divider />

        {/* Headings */}
        {HEADINGS.map((level) => (
          <ToolBtn
            key={level}
            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
            active={editor.isActive('heading', { level })}
            title={`Heading ${level}`}
          >
            <span className="font-bold text-xs">H{level}</span>
          </ToolBtn>
        ))}

        {/* Font Size */}
        <select
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => setFontSize(e.target.value)}
          className="h-8 px-1.5 rounded text-xs bg-dark border border-dark-border text-gray-300 focus:outline-none focus:border-primary/50 ml-0.5"
          defaultValue=""
          title="Font size"
        >
          <option value="" disabled>Size</option>
          {FONT_SIZES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <Divider />

        {/* Formatting */}
        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
          <Bold size={18} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
          <Italic size={18} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
          <Underline size={18} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
          <Strikethrough size={18} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline code">
          <Code size={18} />
        </ToolBtn>

        <Divider />

        {/* Alignment */}
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align left">
          <AlignLeft size={18} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align center">
          <AlignCenter size={18} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align right">
          <AlignRight size={18} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })} title="Justify">
          <AlignJustify size={18} />
        </ToolBtn>

        <Divider />

        {/* Lists & Blocks */}
        <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
          <List size={18} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list">
          <ListOrdered size={18} />
        </ToolBtn>

        <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">
          <Quote size={18} />
        </ToolBtn>

        <ToolBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code block">
          <Code size={18} />
        </ToolBtn>

        <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule">
          <Minus size={18} />
        </ToolBtn>

        <Divider />

        {/* Link */}
        <ToolBtn
          onClick={() => {
            if (editor.isActive('link')) {
              editor.chain().focus().unsetLink().run()
            } else {
              setShowLinkInput((v) => !v)
            }
          }}
          active={editor.isActive('link')}
          title="Insert link"
        >
          {editor.isActive('link') ? <LinkOff size={18} /> : <LinkIcon size={18} />}
        </ToolBtn>

        <ToolBtn onClick={onInsertImage} title="Insert image">
          <Image size={18} />
        </ToolBtn>
      </div>

      {/* Link Input */}
      {showLinkInput && (
        <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-t border-dark-border bg-dark">
          <input
            type="text"
            placeholder="Link text (optional)"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            className="flex-1 min-w-[160px] px-3 py-1.5 rounded-lg bg-dark-card border border-dark-border text-white placeholder-gray-600 text-sm focus:outline-none focus:border-primary/50"
          />
          <input
            type="url"
            placeholder="https://example.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setLink()}
            className="flex-1 min-w-[200px] px-3 py-1.5 rounded-lg bg-dark-card border border-dark-border text-white placeholder-gray-600 text-sm focus:outline-none focus:border-primary/50"
            autoFocus
          />
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); setLink() }}
            className="btn-primary px-4 py-1.5 rounded-lg text-sm"
          >
            Insert
          </button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); setShowLinkInput(false) }}
            className="px-4 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}

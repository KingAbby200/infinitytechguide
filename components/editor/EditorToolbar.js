'use client'
import { useState, useCallback, useRef } from 'react'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Image,
  Link as LinkIcon,
  LinkOff,
  Minus,
  Undo,
  Redo,
} from 'lucide-react'

const HEADINGS = [1, 2, 3, 4]

function ToolBtn({ onMouseDown, active, disabled, title, children }) {
  return (
    <button
      type="button"
      onMouseDown={onMouseDown}
      disabled={disabled}
      title={title}
      className={`w-8 h-8 flex items-center justify-center rounded text-sm transition-all flex-shrink-0 ${
        active
          ? 'bg-primary text-black shadow-sm'
          : 'text-gray-400 hover:text-white hover:bg-white/10'
      } disabled:opacity-25 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="w-px h-5 bg-dark-border mx-0.5 flex-shrink-0 self-center" />
}

export default function EditorToolbar({ editor, onInsertImage }) {
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl,  setLinkUrl]  = useState('')
  const [linkText, setLinkText] = useState('')

  // Stable ref so handlers never close over a stale editor instance
  const editorRef = useRef(editor)
  editorRef.current = editor

  // ── Heading handler ──────────────────────────────────────────────────────
  // e.preventDefault() keeps the editor selection intact on desktop.
  // We call focus() first so Tiptap always knows where the cursor is.
  function makeHeadingHandler(level) {
    return (e) => {
      e.preventDefault()
      editorRef.current?.chain().focus().toggleHeading({ level }).run()
    }
  }

  // ── Link insert ──────────────────────────────────────────────────────────
  // useCallback keeps the reference stable; editorRef avoids stale closures.
  const insertLink = useCallback(() => {
    const ed  = editorRef.current
    if (!ed) return

    const url = linkUrl.trim()

    if (!url) {
      ed.chain().focus().unsetLink().run()
      setShowLinkInput(false)
      setLinkUrl('')
      setLinkText('')
      return
    }

    const href = /^https?:\/\//i.test(url) ? url : `https://${url}`

    try {
      if (!ed.state.selection.empty) {
        // Wrap the current selection in a link
        ed.chain()
          .focus()
          .extendMarkRange('link')
          .setLink({ href, target: '_blank', rel: 'noopener noreferrer' })
          .run()
      } else if (linkText.trim()) {
        // No selection — insert new linked text at cursor
        ed.chain()
          .focus()
          .insertContent(
            `<a href="${href}" target="_blank" rel="noopener noreferrer">${linkText.trim()}</a>&nbsp;`
          )
          .run()
      } else {
        // Fallback — set link mark at cursor
        ed.chain()
          .focus()
          .setLink({ href, target: '_blank', rel: 'noopener noreferrer' })
          .run()
      }
    } catch (err) {
      console.warn('Link insertion error (recovered):', err)
    }

    setShowLinkInput(false)
    setLinkUrl('')
    setLinkText('')
  }, [linkUrl, linkText])

  const removeLink = useCallback(() => {
    editorRef.current?.chain().focus().unsetLink().run()
    setShowLinkInput(false)
  }, [])

  if (!editor) return null

  const isLinkActive = editor.isActive('link')

  return (
    <div className="border-b border-dark-border bg-dark-card">

      {/* ── Main toolbar ── */}
      <div className="flex flex-wrap items-center gap-0.5 p-2">

        {/* Undo / Redo */}
        <ToolBtn
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().undo().run() }}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo size={15} />
        </ToolBtn>
        <ToolBtn
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().redo().run() }}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo size={15} />
        </ToolBtn>

        <Divider />

        {/* Headings */}
        {HEADINGS.map((level) => (
          <ToolBtn
            key={level}
            onMouseDown={makeHeadingHandler(level)}
            active={editor.isActive('heading', { level })}
            title={`Heading ${level}`}
          >
            <span className="font-bold font-display text-xs">H{level}</span>
          </ToolBtn>
        ))}

        <Divider />

        {/* Inline marks */}
        <ToolBtn
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run() }}
          active={editor.isActive('bold')}
          title="Bold"
        >
          <Bold size={15} />
        </ToolBtn>
        <ToolBtn
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run() }}
          active={editor.isActive('italic')}
          title="Italic"
        >
          <Italic size={15} />
        </ToolBtn>
        <ToolBtn
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleUnderline().run() }}
          active={editor.isActive('underline')}
          title="Underline"
        >
          <Underline size={15} />
        </ToolBtn>
        <ToolBtn
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleStrike().run() }}
          active={editor.isActive('strike')}
          title="Strikethrough"
        >
          <Strikethrough size={15} />
        </ToolBtn>

        <Divider />

        {/* Lists & blocks */}
        <ToolBtn
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run() }}
          active={editor.isActive('bulletList')}
          title="Bullet list"
        >
          <List size={15} />
        </ToolBtn>
        <ToolBtn
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run() }}
          active={editor.isActive('orderedList')}
          title="Numbered list"
        >
          <ListOrdered size={15} />
        </ToolBtn>
        <ToolBtn
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run() }}
          active={editor.isActive('blockquote')}
          title="Blockquote"
        >
          <Quote size={15} />
        </ToolBtn>
        <ToolBtn
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setHorizontalRule().run() }}
          title="Horizontal rule"
        >
          <Minus size={15} />
        </ToolBtn>

        <Divider />

        {/* Link */}
        <ToolBtn
          onMouseDown={(e) => {
            e.preventDefault()
            if (isLinkActive) {
              removeLink()
            } else {
              setShowLinkInput(v => !v)
            }
          }}
          active={isLinkActive || showLinkInput}
          title={isLinkActive ? 'Remove link' : 'Insert link'}
        >
          {isLinkActive ? <LinkOff size={15} /> : <LinkIcon size={15} />}
        </ToolBtn>

        {/* Image */}
        <ToolBtn
          onMouseDown={(e) => { e.preventDefault(); onInsertImage?.() }}
          title="Insert image"
        >
          <Image size={15} />
        </ToolBtn>
      </div>

      {/* ── Link input row ── */}
      {showLinkInput && (
        <div className="flex flex-wrap items-center gap-2 px-3 py-2.5 border-t border-dark-border bg-dark">
          <input
            type="text"
            placeholder="Link text (or select text in editor first)"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            className="flex-1 min-w-[160px] px-3 py-1.5 rounded-lg bg-dark-card border border-dark-border text-white placeholder-gray-600 text-sm focus:outline-none focus:border-primary/50"
          />
          <input
            type="url"
            placeholder="https://example.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter')  { e.preventDefault(); insertLink() }
              if (e.key === 'Escape') { setShowLinkInput(false) }
            }}
            className="flex-1 min-w-[200px] px-3 py-1.5 rounded-lg bg-dark-card border border-dark-border text-white placeholder-gray-600 text-sm focus:outline-none focus:border-primary/50"
            autoFocus
          />
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); insertLink() }}
            className="btn-primary px-4 py-1.5 rounded-lg text-sm"
          >
            Insert
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault()
              setShowLinkInput(false)
              setLinkUrl('')
              setLinkText('')
            }}
            className="px-4 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}

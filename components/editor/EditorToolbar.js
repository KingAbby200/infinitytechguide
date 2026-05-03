'use client'
import { useState } from 'react'
import { 
  Bold, Italic, Underline, Strikethrough, Code, 
  Heading1, Heading2, Heading3, List, ListOrdered, 
  Quote, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link, Link2Off, Image, Undo, Redo, Minus 
} from 'lucide-react'

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px']

function ToolBtn({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick?.() }}
      disabled={disabled}
      title={title}
      className={`w-8 h-8 flex items-center justify-center rounded text-sm transition-all ${
        active ? 'bg-primary text-black' : 'text-gray-400 hover:text-white hover:bg-white/8'
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

  const setLink = () => {
    if (!linkUrl) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      setShowLinkInput(false)
      return
    }
    const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    setLinkUrl('')
    setLinkText('')
    setShowLinkInput(false)
  }

  return (
    <div className="border-b border-dark-border bg-dark-card">
      <div className="flex flex-wrap items-center gap-0.5 p-2">
        <ToolBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
          <Undo size={17} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
          <Redo size={17} />
        </ToolBtn>

        <Divider />


        
       

        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 4 })}>
            <Heading1 size={17} /> {/* You can change per level if wanted */}
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 4 })}>
            <Heading2 size={17} /> {/* You can change per level if wanted */}
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 4 })}>
            <Heading3 size={17} /> {/* You can change per level if wanted */}
        </ToolBtn>

        <Divider />

        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}>
          <Bold size={17} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}>
          <Italic size={17} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')}>
          <Underline size={17} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')}>
          <Strikethrough size={17} />
        </ToolBtn>

        <Divider />

        <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}>
          <List size={17} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')}>
          <ListOrdered size={17} />
        </ToolBtn>

        <ToolBtn onClick={onInsertImage} title="Insert Image">
          <Image size={17} />
        </ToolBtn>

        <ToolBtn onClick={() => setShowLinkInput(v => !v)} active={editor.isActive('link')}>
          {editor.isActive('link') ? <Link2Off size={17} /> : <Link size={17} />}
        </ToolBtn>
      </div>

      {/* Link Input */}
      {showLinkInput && (
        <div className="p-3 border-t border-dark-border bg-dark flex gap-2">
          <input type="url" placeholder="https://..." value={linkUrl} onChange={e => setLinkUrl(e.target.value)} className="flex-1 px-3 py-2 bg-dark-card border border-dark-border rounded" />
          <button onClick={setLink} className="btn-primary px-4">Insert</button>
        </div>
      )}
    </div>
  )
}
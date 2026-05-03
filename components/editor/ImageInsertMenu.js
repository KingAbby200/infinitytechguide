'use client'
import { useState, useRef } from 'react'
import { HiX, HiPhotograph, HiLink, HiUpload } from 'react-icons/hi'

export default function ImageInsertMenu({ onInsert, onClose }) {
  const [tab, setTab]             = useState('url')   // 'url' | 'upload'
  const [url, setUrl]             = useState('')
  const [alt, setAlt]             = useState('')
  const [width, setWidth]         = useState('100%')
  const [align, setAlign]         = useState('none')
  const [borderRadius, setBR]     = useState('8px')
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview]     = useState('')
  const fileRef                   = useRef()

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'posts')
      const res  = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setUrl(data.url)
      setPreview(data.url)
    } catch (err) {
      alert('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  function handleInsert() {
    if (!url) return
    onInsert({ src: url, alt, width, align, borderRadius })
  }

  const ALIGNS = [
    { value: 'none',   label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right',  label: 'Right' },
  ]

  const BR_OPTIONS = [
    { value: '0px',   label: 'None' },
    { value: '6px',   label: 'Small' },
    { value: '12px',  label: 'Medium' },
    { value: '20px',  label: 'Large' },
    { value: '9999px',label: 'Pill' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-dark-card border border-dark-border rounded-2xl w-full max-w-lg shadow-card animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-dark-border">
          <h3 className="font-display font-semibold text-white">Insert Image</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/5">
            <HiX size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Tabs */}
          <div className="flex gap-2 bg-dark rounded-lg p-1">
            <button
              type="button"
              onClick={() => setTab('url')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm transition-all ${
                tab === 'url' ? 'bg-dark-card text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <HiLink size={15} /> From URL
            </button>
            <button
              type="button"
              onClick={() => setTab('upload')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm transition-all ${
                tab === 'upload' ? 'bg-dark-card text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <HiUpload size={15} /> Upload
            </button>
          </div>

          {/* Source */}
          {tab === 'url' ? (
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={url}
              onChange={e => { setUrl(e.target.value); setPreview(e.target.value) }}
              className="w-full px-4 py-2.5 rounded-xl bg-dark border border-dark-border text-white placeholder-gray-600 text-sm focus:outline-none focus:border-primary/50"
            />
          ) : (
            <div>
              <input type="file" accept="image/*" ref={fileRef} onChange={handleUpload} className="hidden" />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full py-8 border-2 border-dashed border-dark-border rounded-xl flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-primary/40 hover:text-gray-300 transition-all disabled:opacity-60"
              >
                <HiPhotograph size={28} />
                <span className="text-sm">{uploading ? 'Uploading…' : 'Click to choose an image from your device'}</span>
              </button>
            </div>
          )}

          {/* Alt text */}
          <input
            type="text"
            placeholder="Alt text (for accessibility & SEO)"
            value={alt}
            onChange={e => setAlt(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-dark border border-dark-border text-white placeholder-gray-600 text-sm focus:outline-none focus:border-primary/50"
          />

          {/* Controls row */}
          <div className="grid grid-cols-3 gap-3">
            {/* Width */}
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Width</label>
              <input
                type="text"
                value={width}
                onChange={e => setWidth(e.target.value)}
                placeholder="100% or 400px"
                className="w-full px-3 py-2 rounded-lg bg-dark border border-dark-border text-white text-sm focus:outline-none focus:border-primary/50"
              />
            </div>

            {/* Align */}
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Align</label>
              <select
                value={align}
                onChange={e => setAlign(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-dark border border-dark-border text-white text-sm focus:outline-none focus:border-primary/50"
              >
                {ALIGNS.map(a => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
            </div>

            {/* Border radius */}
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Corners</label>
              <select
                value={borderRadius}
                onChange={e => setBR(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-dark border border-dark-border text-white text-sm focus:outline-none focus:border-primary/50"
              >
                {BR_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Preview */}
          {preview && (
            <div className="rounded-xl overflow-hidden border border-dark-border bg-dark p-2 text-center">
              <img
                src={preview}
                alt="preview"
                style={{ width, borderRadius, margin: align === 'center' ? '0 auto' : undefined, display: 'block' }}
                className="max-h-48 object-contain"
                onError={() => setPreview('')}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm text-gray-400 border border-dark-border hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleInsert}
              disabled={!url || uploading}
              className="flex-1 btn-primary py-2.5 rounded-xl text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Insert Image
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
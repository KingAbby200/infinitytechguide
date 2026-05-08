'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { HiPhotograph, HiTag, HiX, HiSave, HiChevronDown } from 'react-icons/hi'

// Do NOT use dynamic() here — it resolves to undefined in Next 14 App Router
// when the parent is already a Client Component receiving serialised server props.
// Instead we guard rendering with a `mounted` flag so Tiptap (browser-only)
// never runs on the server.
import TiptapEditor from '@/components/editor/TiptapEditor'

export default function PostForm({ post, categories = [], subcategories = [], isAdmin }) {
  const router = useRouter()
  const isEdit = !!post

  // Guard: only render the editor after hydration
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const [title,          setTitle]         = useState(post?.title           || '')
  const [content,        setContent]       = useState(post?.content         || '')
  const [headingImage,   setHeadingImage]  = useState(post?.headingImage    || '')
  const [excerpt,        setExcerpt]       = useState(post?.excerpt         || '')
  const [categoryId,     setCategoryId]    = useState(
    post?.category?._id?.toString() || post?.category?.toString() || ''
  )
  const [subcategoryId,  setSubcategoryId] = useState(
    post?.subcategory?._id?.toString() || post?.subcategory?.toString() || ''
  )
  const [tags,           setTags]          = useState(post?.tags            || [])
  const [tagInput,       setTagInput]      = useState('')
  const [metaTitle,      setMetaTitle]     = useState(post?.metaTitle       || '')
  const [metaDesc,       setMetaDesc]      = useState(post?.metaDescription || '')
  const [metaImage,      setMetaImage]     = useState(post?.metaImage       || '')

  // New category on-the-fly (admin only)
  const [newCatName,  setNewCatName]  = useState('')
  const [newSubName,  setNewSubName]  = useState('')
  const [showNewCat,  setShowNewCat]  = useState(false)
  const [showNewSub,  setShowNewSub]  = useState(false)

  const [uploading, setUploading] = useState(false)
  const [saving,    setSaving]    = useState(false)
  const [errors,    setErrors]    = useState({})
  const [showSeo,   setShowSeo]   = useState(false)

  const imgRef = useRef()

  // Filter subcategories for selected parent category
  const filteredSubs = subcategories.filter(s => {
    const parentId = s.parent?._id?.toString() || s.parent?.toString() || ''
    return parentId === categoryId
  })

  async function uploadHeadingImage(file) {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'posts')
      const res  = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setHeadingImage(data.url)
    } catch (err) {
      alert('Image upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  function addTag(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const t = tagInput.trim().toLowerCase().replace(/^#/, '')
      if (t && !tags.includes(t) && tags.length < 10) {
        setTags(prev => [...prev, t])
      }
      setTagInput('')
    }
  }

  function removeTag(t) { setTags(prev => prev.filter(x => x !== t)) }

  function validate() {
    const e = {}
    if (!title.trim())        e.title        = 'Title is required'
    if (!content || content === '<p></p>') e.content = 'Content is required'
    if (!headingImage)        e.headingImage = 'Heading image is required'
    if (!categoryId && !newCatName) e.category = 'Category is required'
    return e
  }

  async function handleSave(asDraft = false) {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSaving(true)
    setErrors({})

    try {
      const payload = {
        title,
        content,
        headingImage,
        excerpt,
        categoryId:         showNewCat ? '__new__' : categoryId,
        subcategoryId:      showNewSub ? '__new__' : (subcategoryId || null),
        newCategoryName:    showNewCat ? newCatName : undefined,
        newSubcategoryName: showNewSub ? newSubName : undefined,
        tags,
        metaTitle:        metaTitle || title,
        metaDescription:  metaDesc  || excerpt,
        metaImage:        metaImage || headingImage,
      }

      if (asDraft && !isEdit) payload.status = 'draft'

      const url    = isEdit ? `/api/posts/${post._id}` : '/api/posts'
      const method = isEdit ? 'PUT' : 'POST'

      const res  = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')

      router.push('/author')
      router.refresh()
    } catch (err) {
      setErrors({ form: err.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {errors.form && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {errors.form}
        </div>
      )}

      {/* ── Title ── */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Post Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter a compelling title…"
          className={`w-full px-4 py-3 rounded-xl bg-dark-card border text-white placeholder-gray-600 text-lg font-display focus:outline-none focus:border-primary/50 transition-colors ${
            errors.title ? 'border-red-500/50' : 'border-dark-border'
          }`}
        />
        {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
      </div>

      {/* ── Heading Image ── */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Heading Image <span className="text-red-400">*</span>
        </label>
        <div className="flex gap-3">
          <input
            type="url"
            value={headingImage}
            onChange={e => setHeadingImage(e.target.value)}
            placeholder="Paste image URL or upload below"
            className={`flex-1 px-4 py-2.5 rounded-xl bg-dark-card border text-white placeholder-gray-600 text-sm focus:outline-none focus:border-primary/50 ${
              errors.headingImage ? 'border-red-500/50' : 'border-dark-border'
            }`}
          />
          <input
            type="file"
            accept="image/*"
            ref={imgRef}
            className="hidden"
            onChange={e => e.target.files?.[0] && uploadHeadingImage(e.target.files[0])}
          />
          <button
            type="button"
            onClick={() => imgRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2.5 rounded-xl bg-dark-card border border-dark-border text-gray-400 hover:text-white hover:border-primary/30 text-sm flex items-center gap-2 transition-all disabled:opacity-60"
          >
            <HiPhotograph size={16} />
            {uploading ? 'Uploading…' : 'Upload'}
          </button>
        </div>
        {errors.headingImage && <p className="text-red-400 text-xs mt-1">{errors.headingImage}</p>}
        {headingImage && (
          <div className="mt-3 rounded-xl overflow-hidden h-48 bg-dark-muted">
            <img src={headingImage} alt="Heading preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* ── Category + Subcategory ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Category <span className="text-red-400">*</span>
          </label>
          {!showNewCat ? (
            <div className="flex gap-2">
              <select
                value={categoryId}
                onChange={e => { setCategoryId(e.target.value); setSubcategoryId('') }}
                className={`flex-1 px-3 py-2.5 rounded-xl bg-dark-card border text-white text-sm focus:outline-none focus:border-primary/50 ${
                  errors.category ? 'border-red-500/50' : 'border-dark-border'
                }`}
              >
                <option value="">Select category…</option>
                {categories.map(c => (
                  <option key={c._id} value={c._id.toString()}>{c.name}</option>
                ))}
              </select>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setShowNewCat(true)}
                  className="px-3 py-2 rounded-xl bg-dark-card border border-dark-border text-gray-400 hover:text-primary hover:border-primary/30 text-xs transition-all"
                >
                  + New
                </button>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                placeholder="New category name"
                className="flex-1 px-3 py-2.5 rounded-xl bg-dark-card border border-primary/40 text-white text-sm focus:outline-none"
                autoFocus
              />
              <button type="button" onClick={() => setShowNewCat(false)} className="px-3 py-2 rounded-xl text-gray-400 hover:text-white">
                <HiX size={15} />
              </button>
            </div>
          )}
          {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Subcategory <span className="text-gray-600">(optional)</span>
          </label>
          {!showNewSub ? (
            <div className="flex gap-2">
              <select
                value={subcategoryId}
                onChange={e => setSubcategoryId(e.target.value)}
                disabled={!categoryId && !showNewCat}
                className="flex-1 px-3 py-2.5 rounded-xl bg-dark-card border border-dark-border text-white text-sm focus:outline-none focus:border-primary/50 disabled:opacity-40"
              >
                <option value="">None</option>
                {filteredSubs.map(s => (
                  <option key={s._id} value={s._id.toString()}>{s.name}</option>
                ))}
              </select>
              {isAdmin && categoryId && (
                <button
                  type="button"
                  onClick={() => setShowNewSub(true)}
                  className="px-3 py-2 rounded-xl bg-dark-card border border-dark-border text-gray-400 hover:text-primary hover:border-primary/30 text-xs transition-all"
                >
                  + New
                </button>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubName}
                onChange={e => setNewSubName(e.target.value)}
                placeholder="New subcategory name"
                className="flex-1 px-3 py-2.5 rounded-xl bg-dark-card border border-primary/40 text-white text-sm focus:outline-none"
                autoFocus
              />
              <button type="button" onClick={() => setShowNewSub(false)} className="px-3 py-2 rounded-xl text-gray-400 hover:text-white">
                <HiX size={15} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Content Editor ── */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Content <span className="text-red-400">*</span>
        </label>

        {/* Only render Tiptap after client hydration */}
        {mounted ? (
          <TiptapEditor
            content={content}
            onChange={setContent}
            placeholder="Write your post here. Use the toolbar to format text, add images, links, and headings…"
          />
        ) : (
          <div className="border border-dark-border rounded-xl h-64 flex items-center justify-center text-gray-600 text-sm bg-dark-card">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
              Loading editor…
            </div>
          </div>
        )}

        {errors.content && <p className="text-red-400 text-xs mt-1">{errors.content}</p>}
      </div>

      {/* ── Excerpt ── */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Excerpt <span className="text-gray-600">(auto-generated if empty)</span>
        </label>
        <textarea
          value={excerpt}
          onChange={e => setExcerpt(e.target.value)}
          placeholder="A short summary shown on post cards and search results…"
          rows={3}
          maxLength={300}
          className="w-full px-4 py-3 rounded-xl bg-dark-card border border-dark-border text-white placeholder-gray-600 text-sm focus:outline-none focus:border-primary/50 resize-none"
        />
        <p className="text-gray-600 text-xs mt-1 text-right">{excerpt.length}/300</p>
      </div>

      {/* ── Tags ── */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">
          <HiTag size={14} className="inline mr-1" />
          Tags <span className="text-gray-600">(press Enter or comma, max 10)</span>
        </label>
        <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-dark-card border border-dark-border min-h-[48px] focus-within:border-primary/50 transition-colors">
          {tags.map(t => (
            <span key={t} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs">
              #{t}
              <button type="button" onClick={() => removeTag(t)} className="hover:text-white ml-1">
                <HiX size={11} />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={addTag}
            placeholder={tags.length === 0 ? 'Add tags for SEO…' : ''}
            className="flex-1 min-w-[120px] bg-transparent text-white text-sm placeholder-gray-600 focus:outline-none"
          />
        </div>
      </div>

      {/* ── SEO accordion ── */}
      <div className="border border-dark-border rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowSeo(v => !v)}
          className="w-full flex items-center justify-between px-5 py-4 bg-dark-card hover:bg-dark-hover transition-colors text-left"
        >
          <span className="text-sm font-medium text-gray-300">
            SEO &amp; Metadata{' '}
            <span className="text-gray-600 font-normal">(optional — auto-filled if empty)</span>
          </span>
          <HiChevronDown size={16} className={`text-gray-400 transition-transform ${showSeo ? 'rotate-180' : ''}`} />
        </button>
        {showSeo && (
          <div className="p-5 space-y-4 border-t border-dark-border">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Meta Title <span className="text-gray-600">(max 60 chars)</span></label>
              <input
                type="text"
                value={metaTitle}
                onChange={e => setMetaTitle(e.target.value)}
                maxLength={60}
                placeholder={title || 'Page title for search engines'}
                className="w-full px-3 py-2.5 rounded-lg bg-dark border border-dark-border text-white placeholder-gray-600 text-sm focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Meta Description <span className="text-gray-600">(max 160 chars)</span></label>
              <textarea
                value={metaDesc}
                onChange={e => setMetaDesc(e.target.value)}
                maxLength={160}
                rows={2}
                placeholder={excerpt || 'Description for search engines'}
                className="w-full px-3 py-2.5 rounded-lg bg-dark border border-dark-border text-white placeholder-gray-600 text-sm focus:outline-none focus:border-primary/50 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Social Share Image URL</label>
              <input
                type="url"
                value={metaImage}
                onChange={e => setMetaImage(e.target.value)}
                placeholder={headingImage || 'https://…'}
                className="w-full px-3 py-2.5 rounded-lg bg-dark border border-dark-border text-white placeholder-gray-600 text-sm focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Save buttons ── */}
      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="button"
          onClick={() => handleSave(false)}
          disabled={saving}
          className="btn-primary px-8 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-glow-sm disabled:opacity-60"
        >
          <HiSave size={16} />
          {saving
            ? 'Saving…'
            : isEdit
              ? 'Save Changes'
              : isAdmin
                ? 'Publish'
                : 'Submit for Review'}
        </button>

        {!isEdit && (
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-8 py-3 rounded-xl font-medium text-sm flex items-center gap-2 bg-dark-card border border-dark-border text-gray-300 hover:text-white hover:border-primary/30 transition-all disabled:opacity-60"
          >
            Save as Draft
          </button>
        )}

        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-xl text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>

      {!isAdmin && (
        <p className="text-gray-600 text-xs">
          Your post will be submitted for admin review before it's published.
        </p>
      )}
    </div>
  )
}

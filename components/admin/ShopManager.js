'use client'
import { useState, useRef } from 'react'
import { HiPlus, HiTrash, HiPencil, HiPhotograph, HiX, HiStar } from 'react-icons/hi'

const EMPTY_FORM = { name: '', description: '', price: '', category: '', brand: '', inStock: true, featured: false, images: [], specs: {} }

export default function ShopManager({ products: initProducts }) {
  const [products,  setProducts]  = useState(initProducts)
  const [showForm,  setShowForm]  = useState(false)
  const [editId,    setEditId]    = useState(null)
  const [form,      setForm]      = useState(EMPTY_FORM)
  const [errors,    setErrors]    = useState({})
  const [saving,    setSaving]    = useState(false)
  const [uploading, setUploading] = useState(false)
  const [newSpecKey,   setNewSpecKey]   = useState('')
  const [newSpecValue, setNewSpecValue] = useState('')
  const fileRef = useRef()

  function openCreate() { setForm(EMPTY_FORM); setEditId(null); setErrors({}); setShowForm(true) }
  function openEdit(p)  {
    setForm({
      name:        p.name,
      description: p.description || '',
      price:       p.price.toString(),
      category:    p.category    || '',
      brand:       p.brand       || '',
      inStock:     p.inStock,
      featured:    p.featured,
      images:      p.images      || [],
      specs:       p.specs       || {},
    })
    setEditId(p._id)
    setErrors({})
    setShowForm(true)
  }

  function setF(key, val) { setForm(v => ({ ...v, [key]: val })) }

  async function uploadImages(files) {
    setUploading(true)
    const urls = []
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'products')
      const res  = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok) urls.push(data.url)
    }
    setF('images', [...form.images, ...urls])
    setUploading(false)
  }

  function addSpec() {
    if (!newSpecKey.trim()) return
    setF('specs', { ...form.specs, [newSpecKey.trim()]: newSpecValue.trim() })
    setNewSpecKey(''); setNewSpecValue('')
  }

  function removeSpec(key) {
    const s = { ...form.specs }
    delete s[key]
    setF('specs', s)
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name required'
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0) e.price = 'Valid price required'
    return e
  }

  async function handleSave(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    try {
      const payload = { ...form, price: Number(form.price) }
      const url    = editId ? `/api/products/${editId}` : '/api/products'
      const method = editId ? 'PUT' : 'POST'
      const res  = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      if (editId) {
        setProducts(prev => prev.map(p => p._id === editId ? data : p))
      } else {
        setProducts(prev => [data, ...prev])
      }
      setShowForm(false)
      setEditId(null)
    } catch (err) {
      setErrors({ form: err.message })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete "${name}"?`)) return
    await fetch(`/api/products/${id}`, { method: 'DELETE' })
    setProducts(prev => prev.filter(p => p._id !== id))
  }

  return (
    <div className="space-y-5">
      <button onClick={openCreate} className="btn-primary px-5 py-2.5 rounded-xl text-sm flex items-center gap-2">
        <HiPlus size={16} /> Add Gadget
      </button>

      {/* Form */}
      {showForm && (
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-semibold text-white">{editId ? 'Edit Gadget' : 'New Gadget'}</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white">
              <HiX size={18} />
            </button>
          </div>

          {errors.form && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{errors.form}</div>
          )}

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Product Name *</label>
                <input type="text" value={form.name} onChange={e => setF('name', e.target.value)} placeholder="iPhone 16 Pro" className={`w-full px-3 py-2.5 rounded-lg bg-dark border text-white text-sm focus:outline-none focus:border-primary/50 ${errors.name ? 'border-red-500/50' : 'border-dark-border'}`} />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Price (₦) *</label>
                <input type="number" value={form.price} onChange={e => setF('price', e.target.value)} placeholder="350000" min="0" className={`w-full px-3 py-2.5 rounded-lg bg-dark border text-white text-sm focus:outline-none focus:border-primary/50 ${errors.price ? 'border-red-500/50' : 'border-dark-border'}`} />
                {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Brand</label>
                <input type="text" value={form.brand} onChange={e => setF('brand', e.target.value)} placeholder="Apple" className="w-full px-3 py-2.5 rounded-lg bg-dark border border-dark-border text-white text-sm focus:outline-none focus:border-primary/50" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Category</label>
                <input type="text" value={form.category} onChange={e => setF('category', e.target.value)} placeholder="Smartphones" className="w-full px-3 py-2.5 rounded-lg bg-dark border border-dark-border text-white text-sm focus:outline-none focus:border-primary/50" />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Description</label>
              <textarea value={form.description} onChange={e => setF('description', e.target.value)} placeholder="Product description…" rows={3} className="w-full px-3 py-2.5 rounded-lg bg-dark border border-dark-border text-white text-sm focus:outline-none focus:border-primary/50 resize-none" />
            </div>

            {/* Images */}
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Images</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.images.map((img, i) => (
                  <div key={i} className="relative group">
                    <img src={img} alt="" className="w-16 h-16 rounded-lg object-cover border border-dark-border" />
                    <button type="button" onClick={() => setF('images', form.images.filter((_, j) => j !== i))} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      <HiX size={10} />
                    </button>
                  </div>
                ))}
                <input type="file" accept="image/*" multiple ref={fileRef} className="hidden" onChange={e => uploadImages(e.target.files)} />
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="w-16 h-16 rounded-lg border-2 border-dashed border-dark-border flex items-center justify-center text-gray-600 hover:border-primary/40 hover:text-gray-400 transition-all disabled:opacity-50">
                  {uploading ? '…' : <HiPhotograph size={20} />}
                </button>
              </div>
              <p className="text-gray-600 text-xs">Or paste URLs directly above.</p>
            </div>

            {/* Specs */}
            <div>
              <label className="block text-xs text-gray-500 mb-2">Specifications</label>
              {Object.entries(form.specs).length > 0 && (
                <div className="mb-2 space-y-1">
                  {Object.entries(form.specs).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-2 text-sm">
                      <span className="text-gray-400 w-28 truncate capitalize">{k}</span>
                      <span className="text-gray-300 flex-1">{v}</span>
                      <button type="button" onClick={() => removeSpec(k)} className="text-gray-600 hover:text-red-400"><HiX size={13} /></button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input type="text" value={newSpecKey} onChange={e => setNewSpecKey(e.target.value)} placeholder="Spec name" className="flex-1 px-3 py-2 rounded-lg bg-dark border border-dark-border text-white text-xs focus:outline-none focus:border-primary/50" />
                <input type="text" value={newSpecValue} onChange={e => setNewSpecValue(e.target.value)} placeholder="Value" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSpec())} className="flex-1 px-3 py-2 rounded-lg bg-dark border border-dark-border text-white text-xs focus:outline-none focus:border-primary/50" />
                <button type="button" onClick={addSpec} className="px-3 py-2 rounded-lg bg-dark-muted text-gray-400 hover:text-white text-xs">Add</button>
              </div>
            </div>

            {/* Toggles */}
            <div className="flex gap-6">
              {[
                { key: 'inStock',  label: 'In Stock' },
                { key: 'featured', label: 'Featured', icon: HiStar },
              ].map(({ key, label, icon: Icon }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => setF(key, !form[key])}
                    className={`w-10 h-5 rounded-full relative transition-colors ${form[key] ? 'bg-primary' : 'bg-dark-muted border border-dark-border'}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                  <span className="text-sm text-gray-300 flex items-center gap-1">
                    {Icon && <Icon size={14} className="text-yellow-400" />} {label}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary px-7 py-2.5 rounded-xl text-sm disabled:opacity-60">
                {saving ? 'Saving…' : editId ? 'Save Changes' : 'Add Product'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-7 py-2.5 rounded-xl text-sm border border-dark-border text-gray-400 hover:text-white transition-all">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products grid */}
      {products.length === 0 ? (
        <div className="text-center py-16 bg-dark-card border border-dark-border rounded-xl text-gray-600">
          No products yet. Add your first gadget!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p._id} className="bg-dark-card border border-dark-border rounded-xl overflow-hidden group">
              <div className="relative aspect-video overflow-hidden bg-dark-muted">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-700 text-3xl">📱</div>
                )}
                {p.featured && (
                  <span className="absolute top-2 left-2 flex items-center gap-1 tag text-[10px]">
                    <HiStar size={9} /> Featured
                  </span>
                )}
                {!p.inStock && (
                  <div className="absolute inset-0 bg-dark/60 flex items-center justify-center">
                    <span className="text-gray-400 text-xs font-medium">Out of Stock</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="min-w-0">
                    {p.brand && <p className="text-gray-600 text-xs">{p.brand}</p>}
                    <p className="text-white font-medium text-sm line-clamp-1">{p.name}</p>
                  </div>
                  <p className="text-primary font-bold text-sm flex-shrink-0">₦{p.price.toLocaleString()}</p>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => openEdit(p)} className="flex-1 py-1.5 rounded-lg bg-dark border border-dark-border text-gray-400 hover:text-primary hover:border-primary/30 text-xs flex items-center justify-center gap-1 transition-all">
                    <HiPencil size={12} /> Edit
                  </button>
                  <button onClick={() => handleDelete(p._id, p.name)} className="flex-1 py-1.5 rounded-lg bg-dark border border-dark-border text-gray-400 hover:text-red-400 hover:border-red-400/30 text-xs flex items-center justify-center gap-1 transition-all">
                    <HiTrash size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
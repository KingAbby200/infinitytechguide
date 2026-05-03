'use client'
import { useState } from 'react'
import { HiPlus, HiTrash, HiPencil, HiCheck, HiX, HiTag, HiChevronDown, HiChevronRight } from 'react-icons/hi'

function CategoryRow({ cat, onDelete, onEdit, children, isParent }) {
  const [expanded, setExpanded] = useState(true)
  const [editing,  setEditing]  = useState(false)
  const [name,     setName]     = useState(cat.name)
  const [saving,   setSaving]   = useState(false)

  async function handleEdit() {
    if (!name.trim() || name === cat.name) { setEditing(false); return }
    setSaving(true)
    await onEdit(cat._id, name)
    setSaving(false)
    setEditing(false)
  }

  return (
    <div>
      <div className={`flex items-center gap-2 px-4 py-2.5 ${isParent ? 'bg-dark-card' : 'bg-dark pl-8'} border-b border-dark-border hover:bg-dark-hover transition-colors group`}>
        {isParent && (
          <button onClick={() => setExpanded(v => !v)} className="text-gray-600 hover:text-gray-300 mr-1">
            {expanded ? <HiChevronDown size={14} /> : <HiChevronRight size={14} />}
          </button>
        )}
        {!isParent && <HiTag size={12} className="text-gray-600 mr-1" />}

        {editing ? (
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleEdit(); if (e.key === 'Escape') setEditing(false) }}
              className="flex-1 px-2 py-1 rounded-lg bg-dark border border-primary/40 text-white text-sm focus:outline-none"
              autoFocus
            />
            <button onClick={handleEdit} disabled={saving} className="text-primary hover:text-white">
              <HiCheck size={16} />
            </button>
            <button onClick={() => { setEditing(false); setName(cat.name) }} className="text-gray-500 hover:text-white">
              <HiX size={16} />
            </button>
          </div>
        ) : (
          <>
            <span className={`flex-1 text-sm ${isParent ? 'text-white font-medium' : 'text-gray-300'}`}>{cat.name}</span>
            <span className="text-gray-600 text-xs hidden sm:block">{cat.slug}</span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setEditing(true)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-primary hover:bg-white/5"
              >
                <HiPencil size={13} />
              </button>
              <button
                onClick={() => onDelete(cat._id, cat.name)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-red-400 hover:bg-white/5"
              >
                <HiTrash size={13} />
              </button>
            </div>
          </>
        )}
      </div>
      {isParent && expanded && children}
    </div>
  )
}

export default function CategoryManager({ parents: initParents, subcategories: initSubs }) {
  const [parents, setParents] = useState(initParents)
  const [subs,    setSubs]    = useState(initSubs)

  const [newParentName, setNewParentName] = useState('')
  const [newSubName,    setNewSubName]    = useState('')
  const [newSubParent,  setNewSubParent]  = useState('')
  const [savingP,       setSavingP]       = useState(false)
  const [savingS,       setSavingS]       = useState(false)

  async function createCategory(name, parentId = null) {
    const res  = await fetch('/api/categories', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, parent: parentId || null }),
    })
    const data = await res.json()
    if (!res.ok) { alert(data.error); return null }
    return data
  }

  async function handleCreateParent(e) {
    e.preventDefault()
    if (!newParentName.trim()) return
    setSavingP(true)
    const cat = await createCategory(newParentName)
    if (cat) { setParents(prev => [...prev, cat]); setNewParentName('') }
    setSavingP(false)
  }

  async function handleCreateSub(e) {
    e.preventDefault()
    if (!newSubName.trim() || !newSubParent) return
    setSavingS(true)
    const sub = await createCategory(newSubName, newSubParent)
    if (sub) { setSubs(prev => [...prev, sub]); setNewSubName(''); setNewSubParent('') }
    setSavingS(false)
  }

  async function handleEdit(id, name) {
    const res  = await fetch(`/api/categories/${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name }),
    })
    const data = await res.json()
    if (!res.ok) { alert(data.error); return }
    setParents(prev => prev.map(p => p._id === id ? { ...p, name: data.name, slug: data.slug } : p))
    setSubs(prev    => prev.map(s => s._id === id ? { ...s, name: data.name, slug: data.slug } : s))
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete "${name}"? This will also delete all its subcategories.`)) return
    await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    setParents(prev => prev.filter(p => p._id !== id))
    setSubs(prev    => prev.filter(s => s._id !== id && s.parent?.toString() !== id))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Tree */}
      <div className="lg:col-span-2">
        <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
          {parents.length === 0 ? (
            <div className="py-12 text-center text-gray-600 text-sm">No categories yet. Add one below.</div>
          ) : (
            parents.map(parent => {
              const children = subs.filter(s => s.parent?.toString() === parent._id.toString())
              return (
                <CategoryRow key={parent._id} cat={parent} onDelete={handleDelete} onEdit={handleEdit} isParent>
                  {children.map(sub => (
                    <CategoryRow key={sub._id} cat={sub} onDelete={handleDelete} onEdit={handleEdit} isParent={false} />
                  ))}
                </CategoryRow>
              )
            })
          )}
        </div>
      </div>

      {/* Add forms */}
      <div className="space-y-5">
        {/* New parent */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-5">
          <h3 className="font-display font-semibold text-white text-sm mb-4 flex items-center gap-2">
            <HiPlus size={16} className="text-primary" /> Add Category
          </h3>
          <form onSubmit={handleCreateParent} className="space-y-3">
            <input
              type="text"
              value={newParentName}
              onChange={e => setNewParentName(e.target.value)}
              placeholder="Category name"
              className="w-full px-3 py-2.5 rounded-lg bg-dark border border-dark-border text-white text-sm focus:outline-none focus:border-primary/50"
            />
            <button
              type="submit"
              disabled={savingP || !newParentName.trim()}
              className="w-full btn-primary py-2.5 rounded-lg text-sm disabled:opacity-50"
            >
              {savingP ? 'Adding…' : 'Add Category'}
            </button>
          </form>
        </div>

        {/* New subcategory */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-5">
          <h3 className="font-display font-semibold text-white text-sm mb-4 flex items-center gap-2">
            <HiPlus size={16} className="text-primary" /> Add Subcategory
          </h3>
          <form onSubmit={handleCreateSub} className="space-y-3">
            <select
              value={newSubParent}
              onChange={e => setNewSubParent(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-dark border border-dark-border text-white text-sm focus:outline-none focus:border-primary/50"
            >
              <option value="">Select parent category…</option>
              {parents.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
            <input
              type="text"
              value={newSubName}
              onChange={e => setNewSubName(e.target.value)}
              placeholder="Subcategory name"
              className="w-full px-3 py-2.5 rounded-lg bg-dark border border-dark-border text-white text-sm focus:outline-none focus:border-primary/50"
            />
            <button
              type="submit"
              disabled={savingS || !newSubName.trim() || !newSubParent}
              className="w-full btn-primary py-2.5 rounded-lg text-sm disabled:opacity-50"
            >
              {savingS ? 'Adding…' : 'Add Subcategory'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
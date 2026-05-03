'use client'
import { useState } from 'react'
import { format } from 'date-fns'
import { HiPlus, HiTrash, HiUser, HiMail, HiEye, HiEyeOff } from 'react-icons/hi'

export default function UserManager({ users: initialUsers }) {
  const [users,      setUsers]      = useState(initialUsers)
  const [showForm,   setShowForm]   = useState(false)
  const [loadingId,  setLoadingId]  = useState(null)
  const [showPw,     setShowPw]     = useState(false)
  const [form,       setForm]       = useState({ name: '', email: '', password: '', bio: '' })
  const [errors,     setErrors]     = useState({})
  const [saving,     setSaving]     = useState(false)

  function validate() {
    const e = {}
    if (!form.name.trim())    e.name     = 'Name required'
    if (!form.email.trim())   e.email    = 'Email required'
    if (!form.password || form.password.length < 8) e.password = 'Minimum 8 characters'
    return e
  }

  async function handleCreate(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    try {
      const res  = await fetch('/api/users', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setUsers(prev => [data, ...prev])
      setForm({ name: '', email: '', password: '', bio: '' })
      setShowForm(false)
      setErrors({})
    } catch (err) {
      setErrors({ form: err.message })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(userId, name) {
    if (!confirm(`Delete author "${name}"? Their posts will remain but the account will be removed.`)) return
    setLoadingId(userId)
    await fetch(`/api/users/${userId}`, { method: 'DELETE' })
    setUsers(prev => prev.filter(u => u._id !== userId))
    setLoadingId(null)
  }

  return (
    <div className="space-y-5">
      {/* Create button */}
      <button
        onClick={() => setShowForm(v => !v)}
        className="btn-primary px-5 py-2.5 rounded-xl text-sm flex items-center gap-2"
      >
        <HiPlus size={16} /> Create Author Account
      </button>

      {/* Create form */}
      {showForm && (
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 animate-slide-up">
          <h3 className="font-display font-semibold text-white mb-4">New Author Account</h3>
          {errors.form && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{errors.form}</div>
          )}
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Full Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(v => ({ ...v, name: e.target.value }))}
                placeholder="Jane Smith"
                className={`w-full px-3 py-2.5 rounded-lg bg-dark border text-white text-sm focus:outline-none focus:border-primary/50 ${errors.name ? 'border-red-500/50' : 'border-dark-border'}`}
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Email Address *</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(v => ({ ...v, email: e.target.value }))}
                placeholder="jane@example.com"
                className={`w-full px-3 py-2.5 rounded-lg bg-dark border text-white text-sm focus:outline-none focus:border-primary/50 ${errors.email ? 'border-red-500/50' : 'border-dark-border'}`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Password * (min 8 chars)</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(v => ({ ...v, password: e.target.value }))}
                  placeholder="••••••••"
                  className={`w-full px-3 py-2.5 pr-10 rounded-lg bg-dark border text-white text-sm focus:outline-none focus:border-primary/50 ${errors.password ? 'border-red-500/50' : 'border-dark-border'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPw ? <HiEyeOff size={16} /> : <HiEye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Short Bio (optional)</label>
              <input
                type="text"
                value={form.bio}
                onChange={e => setForm(v => ({ ...v, bio: e.target.value }))}
                placeholder="Tech journalist, gadget enthusiast…"
                maxLength={200}
                className="w-full px-3 py-2.5 rounded-lg bg-dark border border-dark-border text-white text-sm focus:outline-none focus:border-primary/50"
              />
            </div>

            <div className="sm:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary px-6 py-2.5 rounded-xl text-sm disabled:opacity-60"
              >
                {saving ? 'Creating…' : 'Create Account'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setErrors({}) }}
                className="px-6 py-2.5 rounded-xl text-sm border border-dark-border text-gray-400 hover:text-white transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users table */}
      {users.length === 0 ? (
        <div className="text-center py-16 bg-dark-card border border-dark-border rounded-xl">
          <HiUser size={40} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500">No author accounts yet.</p>
        </div>
      ) : (
        <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Author</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium hidden sm:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium hidden md:table-cell">Joined</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {users.map(user => (
                <tr key={user._id} className="hover:bg-dark-hover transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                          {user.name?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        {user.bio && <p className="text-gray-600 text-xs line-clamp-1 max-w-[200px]">{user.bio}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">
                    <span className="flex items-center gap-1.5"><HiMail size={13} /> {user.email}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">
                    {format(new Date(user.createdAt), 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(user._id, user.name)}
                      disabled={loadingId === user._id}
                      className="w-8 h-8 inline-flex items-center justify-center rounded-lg bg-dark border border-dark-border text-gray-500 hover:text-red-400 hover:border-red-400/30 transition-all disabled:opacity-50"
                      title="Delete account"
                    >
                      <HiTrash size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
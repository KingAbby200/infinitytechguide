'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { HiPencil, HiTrash } from 'react-icons/hi'

export default function PostActions({ postId, authorId }) {
  const { data: session } = useSession()
  const router            = useRouter()
  const [deleting, setDeleting] = useState(false)

  if (!session) return null

  const isAdmin  = session.user.role === 'admin'
  const isAuthor = session.user.id === authorId

  if (!isAdmin && !isAuthor) return null

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      router.push('/blog')
    } catch {
      alert('Could not delete the post. Please try again.')
      setDeleting(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <a
        href={`/author/edit/${postId}`}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-card border border-dark-border text-gray-400 hover:text-primary hover:border-primary/30 text-sm transition-all"
      >
        <HiPencil size={14} /> Edit
      </a>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-card border border-dark-border text-gray-400 hover:text-red-400 hover:border-red-400/30 text-sm transition-all disabled:opacity-50"
      >
        <HiTrash size={14} /> {deleting ? 'Deleting…' : 'Delete'}
      </button>
    </div>
  )
}
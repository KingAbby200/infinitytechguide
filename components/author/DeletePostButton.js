'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { HiTrash } from 'react-icons/hi'

export default function DeletePostButton({ postId }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm('Delete this post? This cannot be undone.')) return
    setLoading(true)
    await fetch(`/api/posts/${postId}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="w-8 h-8 flex items-center justify-center rounded-lg bg-dark border border-dark-border text-gray-500 hover:text-red-400 hover:border-red-400/30 transition-all disabled:opacity-50"
      title="Delete"
    >
      <HiTrash size={15} />
    </button>
  )
}
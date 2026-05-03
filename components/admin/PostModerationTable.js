'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { HiCheck, HiX, HiPencil, HiTrash, HiEye, HiExternalLink } from 'react-icons/hi'
import Link from 'next/link'

const STATUS_CLASS = {
  pending:   'badge-pending',
  published: 'badge-published',
  rejected:  'badge-rejected',
  draft:     'badge-draft',
}

export default function PostModerationTable({ posts: initialPosts }) {
  const [posts,        setPosts]       = useState(initialPosts)
  const [loadingId,    setLoadingId]   = useState(null)
  const [rejectModal,  setRejectModal] = useState(null)  // postId
  const [rejectReason, setRejectReason] = useState('')
  const router = useRouter()

  async function updateStatus(postId, status, extra = {}) {
    setLoadingId(postId)
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status, ...extra }),
      })
      if (!res.ok) throw new Error('Update failed')
      setPosts(prev => prev.map(p => p._id === postId ? { ...p, status, ...extra } : p))
    } catch (err) {
      alert(err.message)
    } finally {
      setLoadingId(null)
    }
  }

  async function handleDelete(postId) {
    if (!confirm('Delete this post permanently?')) return
    setLoadingId(postId)
    await fetch(`/api/posts/${postId}`, { method: 'DELETE' })
    setPosts(prev => prev.filter(p => p._id !== postId))
    setLoadingId(null)
  }

  async function handleReject() {
    await updateStatus(rejectModal, 'rejected', { rejectionReason: rejectReason })
    setRejectModal(null)
    setRejectReason('')
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16 bg-dark-card border border-dark-border rounded-xl">
        <p className="text-gray-500">No posts found.</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Post</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium hidden md:table-cell">Author</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium hidden lg:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium hidden sm:table-cell">Date</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {posts.map(post => (
                <tr key={post._id} className="hover:bg-dark-hover transition-colors">
                  {/* Post title + thumb */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {post.headingImage && (
                        <img src={post.headingImage} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 hidden sm:block" />
                      )}
                      <div className="min-w-0">
                        <p className="text-white font-medium line-clamp-1">{post.title}</p>
                        <p className="text-gray-600 text-xs flex items-center gap-1">
                          <HiEye size={10} /> {post.views} views · {post.readingTime}m read
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-gray-300">{post.author?.name}</p>
                    <p className="text-gray-600 text-xs">{post.author?.email}</p>
                  </td>

                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-gray-400">{post.category?.name || '—'}</span>
                  </td>

                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-[11px] font-medium ${STATUS_CLASS[post.status] || 'badge-draft'}`}>
                      {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </span>
                    {post.status === 'rejected' && post.rejectionReason && (
                      <p className="text-red-400 text-xs mt-1 max-w-[160px] line-clamp-1" title={post.rejectionReason}>
                        {post.rejectionReason}
                      </p>
                    )}
                  </td>

                  <td className="px-4 py-3 text-gray-500 text-xs hidden sm:table-cell">
                    {format(new Date(post.createdAt), 'MMM d, yyyy')}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {/* Approve */}
                      {post.status === 'pending' && (
                        <button
                          onClick={() => updateStatus(post._id, 'published')}
                          disabled={loadingId === post._id}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-black transition-all disabled:opacity-50"
                          title="Approve & Publish"
                        >
                          <HiCheck size={15} />
                        </button>
                      )}

                      {/* Reject */}
                      {post.status === 'pending' && (
                        <button
                          onClick={() => setRejectModal(post._id)}
                          disabled={loadingId === post._id}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50"
                          title="Reject"
                        >
                          <HiX size={15} />
                        </button>
                      )}

                      {/* Unpublish */}
                      {post.status === 'published' && (
                        <button
                          onClick={() => updateStatus(post._id, 'draft')}
                          disabled={loadingId === post._id}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-dark border border-dark-border text-gray-500 hover:text-yellow-400 transition-all disabled:opacity-50"
                          title="Unpublish"
                        >
                          <HiX size={15} />
                        </button>
                      )}

                      {/* View live */}
                      {post.status === 'published' && (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-dark border border-dark-border text-gray-500 hover:text-primary transition-all"
                          title="View live"
                        >
                          <HiExternalLink size={14} />
                        </Link>
                      )}

                      {/* Edit */}
                      <Link
                        href={`/author/edit/${post._id}`}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-dark border border-dark-border text-gray-500 hover:text-primary transition-all"
                        title="Edit"
                      >
                        <HiPencil size={14} />
                      </Link>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(post._id)}
                        disabled={loadingId === post._id}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-dark border border-dark-border text-gray-500 hover:text-red-400 hover:border-red-400/30 transition-all disabled:opacity-50"
                        title="Delete"
                      >
                        <HiTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-dark-card border border-dark-border rounded-2xl w-full max-w-md p-6 animate-slide-up">
            <h3 className="font-display font-semibold text-white mb-2">Reject Post</h3>
            <p className="text-gray-400 text-sm mb-4">Provide a reason so the author can improve their post.</p>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="e.g. Needs more detail, incorrect information, poor formatting…"
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-dark border border-dark-border text-white placeholder-gray-600 text-sm focus:outline-none focus:border-primary/50 resize-none mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setRejectModal(null); setRejectReason('') }}
                className="flex-1 py-2.5 rounded-xl border border-dark-border text-gray-400 hover:text-white text-sm transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="flex-1 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-sm transition-all"
              >
                Reject Post
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
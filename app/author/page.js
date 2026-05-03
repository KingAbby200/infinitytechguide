import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongoose'
import Post from '@/models/Post'
import Link from 'next/link'
import { format } from 'date-fns'
import { HiPlus, HiPencil, HiTrash, HiEye, HiClock } from 'react-icons/hi'
import DeletePostButton from '@/components/author/DeletePostButton'

const STATUS_CLASS = {
  pending:   'badge-pending',
  published: 'badge-published',
  rejected:  'badge-rejected',
  draft:     'badge-draft',
}

export default async function AuthorPage() {
  const session = await getServerSession(authOptions)
  await connectDB()

  const query = session.user.role === 'admin'
    ? {}
    : { author: session.user.id }

  const posts = await Post.find(query)
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .lean()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">My Posts</h1>
          <p className="text-gray-500 text-sm mt-1">{posts.length} total posts</p>
        </div>
        <Link href="/author/new" className="btn-primary px-5 py-2.5 rounded-xl text-sm flex items-center gap-2">
          <HiPlus size={16} /> New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-dark-card border border-dark-border rounded-2xl">
          <HiPencil size={40} className="text-gray-700 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">You have not written any posts yet.</p>
          <Link href="/author/new" className="btn-primary px-6 py-2.5 rounded-xl text-sm inline-flex items-center gap-2">
            <HiPlus size={16} /> Write your first post
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <div key={post._id.toString()} className="flex items-center gap-4 p-4 bg-dark-card border border-dark-border rounded-xl hover:border-dark-muted transition-all">
              {/* Thumbnail */}
              {post.headingImage && (
                <img src={post.headingImage} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0 hidden sm:block" />
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 mb-1">
                  <h3 className="text-white font-medium text-sm line-clamp-1 flex-1">{post.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium flex-shrink-0 ${STATUS_CLASS[post.status] || 'badge-draft'}`}>
                    {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                  {post.category && <span>{post.category.name}</span>}
                  <span className="flex items-center gap-1"><HiClock size={11} /> {post.readingTime}m read</span>
                  {post.views > 0 && <span className="flex items-center gap-1"><HiEye size={11} /> {post.views} views</span>}
                  <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
                </div>
                {post.status === 'rejected' && post.rejectionReason && (
                  <p className="text-red-400 text-xs mt-1">Reason: {post.rejectionReason}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {post.status === 'published' && (
                  <Link
                    href={`/blog/${post.slug}`}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-dark border border-dark-border text-gray-500 hover:text-primary transition-all"
                    title="View post"
                  >
                    <HiEye size={15} />
                  </Link>
                )}
                <Link
                  href={`/author/edit/${post._id}`}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-dark border border-dark-border text-gray-500 hover:text-primary transition-all"
                  title="Edit"
                >
                  <HiPencil size={15} />
                </Link>
                <DeletePostButton postId={post._id.toString()} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
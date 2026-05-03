import { connectDB } from '@/lib/mongoose'
import Post from '@/models/Post'
import { format } from 'date-fns'
import PostModerationTable from '@/components/admin/PostModerationTable'

export const metadata = { title: 'Admin — Posts' }

async function getPosts(status) {
  await connectDB()
  const query = status ? { status } : {}
  const posts = await Post.find(query)
    .populate('author',   'name email')
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .lean()
  return posts
}

export default async function AdminPostsPage({ searchParams }) {
  const status = searchParams?.status || ''
  const posts  = await getPosts(status)

  const STATUS_TABS = [
    { value: '',          label: 'All' },
    { value: 'pending',   label: 'Pending' },
    { value: 'published', label: 'Published' },
    { value: 'rejected',  label: 'Rejected' },
    { value: 'draft',     label: 'Drafts' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Posts</h1>
          <p className="text-gray-500 text-sm mt-1">{posts.length} posts found</p>
        </div>
        <a href="/author/new" className="btn-primary px-5 py-2.5 rounded-xl text-sm">+ New Post</a>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map(tab => (
          <a
            key={tab.value}
            href={`/admin/posts${tab.value ? `?status=${tab.value}` : ''}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              status === tab.value
                ? 'bg-primary text-black'
                : 'bg-dark-card border border-dark-border text-gray-400 hover:text-white hover:border-primary/30'
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      <PostModerationTable posts={JSON.parse(JSON.stringify(posts))} />
    </div>
  )
}
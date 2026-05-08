import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongoose'
import Post from '@/models/Post'
import Category from '@/models/Category'
import PostForm from '@/components/author/PostForm'
import { notFound, redirect } from 'next/navigation'

export const metadata = { title: 'Edit Post' }

export default async function EditPostPage({ params }) {
  const session = await getServerSession(authOptions)

  // Should be caught by middleware but guard here too
  if (!session) redirect('/auth/signin')

  await connectDB()

  const post = await Post.findById(params.id)
    .populate('category',    'name slug')
    .populate('subcategory', 'name slug')
    .lean()

  if (!post) notFound()

  const isAdmin  = session.user.role === 'admin'
  const isAuthor = post.author.toString() === session.user.id

  if (!isAdmin && !isAuthor) redirect('/author')

  const [categories, subcategories] = await Promise.all([
    Category.find({ parent: null }).sort({ name: 1 }).lean(),
    Category.find({ parent: { $ne: null } }).sort({ name: 1 }).lean(),
  ])

  // Fully serialize — converts ObjectIds, Dates, etc. to plain JSON
  // This prevents "cannot pass non-serialisable value" errors
  const serialized = JSON.parse(JSON.stringify({
    post,
    categories,
    subcategories,
  }))

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-white mb-8">Edit Post</h1>
      <PostForm
        post={serialized.post}
        categories={serialized.categories}
        subcategories={serialized.subcategories}
        isAdmin={isAdmin}
      />
    </div>
  )
}

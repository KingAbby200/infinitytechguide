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
  await connectDB()

  const post = await Post.findById(params.id)
    .populate('category',    'name slug')
    .populate('subcategory', 'name slug')
    .lean()

  if (!post) notFound()

  // Authors can only edit their own posts
  const isAdmin  = session.user.role === 'admin'
  const isAuthor = post.author.toString() === session.user.id
  if (!isAdmin && !isAuthor) redirect('/author')

  const [categories, subcategories] = await Promise.all([
    Category.find({ parent: null }).sort({ name: 1 }).lean(),
    Category.find({ parent: { $ne: null } }).sort({ name: 1 }).lean(),
  ])

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-white mb-8">Edit Post</h1>
      <PostForm
        post={JSON.parse(JSON.stringify(post))}
        categories={JSON.parse(JSON.stringify(categories))}
        subcategories={JSON.parse(JSON.stringify(subcategories))}
        isAdmin={isAdmin}
      />
    </div>
  )
}
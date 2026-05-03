import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongoose'
import Category from '@/models/Category'
import PostForm from '@/components/author/PostForm'

export const metadata = { title: 'New Post' }

export default async function NewPostPage() {
  const session = await getServerSession(authOptions)
  await connectDB()

  const categories = await Category.find({ parent: null })
    .sort({ name: 1 })
    .lean()
  const subcategories = await Category.find({ parent: { $ne: null } })
    .sort({ name: 1 })
    .lean()

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-white mb-8">Create New Post</h1>
      <PostForm
        categories={JSON.parse(JSON.stringify(categories))}
        subcategories={JSON.parse(JSON.stringify(subcategories))}
        isAdmin={session.user.role === 'admin'}
      />
    </div>
  )
}
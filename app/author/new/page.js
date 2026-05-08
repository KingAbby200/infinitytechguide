import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongoose'
import Category from '@/models/Category'
import PostForm from '@/components/author/PostForm'
import { redirect } from 'next/navigation'

export const metadata = { title: 'New Post' }

export default async function NewPostPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin')

  await connectDB()

  const [categories, subcategories] = await Promise.all([
    Category.find({ parent: null }).sort({ name: 1 }).lean(),
    Category.find({ parent: { $ne: null } }).sort({ name: 1 }).lean(),
  ])

  const serialized = JSON.parse(JSON.stringify({ categories, subcategories }))

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-white mb-8">Create New Post</h1>
      <PostForm
        categories={serialized.categories}
        subcategories={serialized.subcategories}
        isAdmin={session.user.role === 'admin'}
      />
    </div>
  )
}

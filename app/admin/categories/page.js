import { connectDB } from '@/lib/mongoose'
import Category from '@/models/Category'
import CategoryManager from '@/components/admin/CategoryManager'

export const metadata = { title: 'Admin — Categories' }

export default async function AdminCategoriesPage() {
  await connectDB()
  const all = await Category.find().sort({ name: 1 }).lean()

  const parents = all.filter(c => !c.parent)
  const subs    = all.filter(c =>  c.parent)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-white">Categories</h1>
        <p className="text-gray-500 text-sm mt-1">Manage blog categories and subcategories.</p>
      </div>
      <CategoryManager
        parents={JSON.parse(JSON.stringify(parents))}
        subcategories={JSON.parse(JSON.stringify(subs))}
      />
    </div>
  )
}
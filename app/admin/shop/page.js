import { connectDB } from '@/lib/mongoose'
import Product from '@/models/Product'
import ShopManager from '@/components/admin/ShopManager'

export const metadata = { title: 'Admin — Shop' }

export default async function AdminShopPage() {
  await connectDB()
  const products = await Product.find().sort({ createdAt: -1 }).lean()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-white">Shop Manager</h1>
        <p className="text-gray-500 text-sm mt-1">Add, edit, and manage gadgets in your store.</p>
      </div>
      <ShopManager products={JSON.parse(JSON.stringify(products))} />
    </div>
  )
}
import { connectDB } from '@/lib/mongoose'
import Product from '@/models/Product'
import GadgetCard from '@/components/shop/GadgetCard'
import CartSidebar from '@/components/shop/CartSidebar'
import { HiShoppingCart } from 'react-icons/hi'

export const metadata = {
  title: 'Shop — Gadgets',
  description: 'Browse the latest tech gadgets. Smartphones, laptops, accessories and more.',
}

async function getProducts(searchParams) {
  await connectDB()
  const category = searchParams?.category || ''
  const page     = Math.max(1, parseInt(searchParams?.page || '1'))
  const limit    = 12

  const query = {}
  if (category) query.category = category

  const [products, total, categories] = await Promise.all([
    Product.find(query)
      .sort({ featured: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Product.countDocuments(query),
    Product.distinct('category'),
  ])

  return { products, total, pages: Math.ceil(total / limit), page, categories: categories.filter(Boolean) }
}

export default async function ShopPage({ searchParams }) {
  const { products, total, pages, page, categories } = await getProducts(searchParams)
  const activeCategory = searchParams?.category || ''

  return (
    <div className="pt-24 pb-20">
      <CartSidebar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12">
          <p className="text-primary text-sm font-medium uppercase tracking-wider mb-2">Tech Store</p>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4 flex items-center gap-3">
            <HiShoppingCart className="text-primary" size={40} />
            Gadgets Shop
          </h1>
          <p className="text-gray-400 max-w-xl">
            Handpicked tech products, tested and reviewed by our team. {total} products available.
          </p>
        </div>

        {/* Category filter */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <a
              href="/shop"
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                !activeCategory
                  ? 'bg-primary text-black'
                  : 'bg-dark-card border border-dark-border text-gray-400 hover:text-white hover:border-primary/30'
              }`}
            >
              All
            </a>
            {categories.map(cat => (
              <a
                key={cat}
                href={`/shop?category=${encodeURIComponent(cat)}`}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-black'
                    : 'bg-dark-card border border-dark-border text-gray-400 hover:text-white hover:border-primary/30'
                }`}
              >
                {cat}
              </a>
            ))}
          </div>
        )}

        {/* Grid */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger">
              {products.map(product => (
                <GadgetCard key={product._id.toString()} product={product} />
              ))}
            </div>

            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <a
                    key={p}
                    href={`/shop?page=${p}${activeCategory ? `&category=${encodeURIComponent(activeCategory)}` : ''}`}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                      p === page
                        ? 'bg-primary text-black'
                        : 'bg-dark-card border border-dark-border text-gray-400 hover:text-white'
                    }`}
                  >
                    {p}
                  </a>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24 text-gray-500">
            <p className="text-xl mb-2">No products yet</p>
            <p className="text-sm">Check back soon — new gadgets are being added regularly!</p>
          </div>
        )}
      </div>
    </div>
  )
}
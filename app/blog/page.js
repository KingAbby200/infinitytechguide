import { connectDB } from '@/lib/mongoose'
import Post from '@/models/Post'
import Category from '@/models/Category'
import User from '@/models/User'
import PostCard from '@/components/blog/PostCard'
import SearchBar from '@/components/blog/SearchBar'
import BlogFilters from '@/components/blog/BlogFilters'

export const metadata = {
  title: 'Blog',
  description: 'Expert tech reviews, guides, and news from Infinity Tech Guide.',
}

async function getData(searchParams) {
  await connectDB()
  const category = searchParams?.category || ''
  const sort     = searchParams?.sort || 'newest'
  const page     = Math.max(1, parseInt(searchParams?.page || '1'))

  const query = { status: 'published' }
  if (category) {
    const cat = await Category.findOne({ slug: category })
    if (cat) query.category = cat._id
  }

  const sortMap = {
    newest:  { publishedAt: -1 },
    popular: { views: -1 },
    oldest:  { publishedAt: 1 },
  }

  const limit = 12
  const [posts, total, categories] = await Promise.all([
    Post.find(query)
      .populate('author',   'name avatar')
      .populate('category', 'name slug')
      .sort(sortMap[sort] || sortMap.newest)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Post.countDocuments(query),
    Category.find({ parent: null }).sort({ name: 1 }).lean(),
  ])

  return { posts, total, pages: Math.ceil(total / limit), page, categories }
}

export default async function BlogPage({ searchParams }) {
  const { posts, total, pages, page, categories } = await getData(searchParams)
  const activeCategory = searchParams?.category || ''
  const activeSort     = searchParams?.sort     || 'newest'

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <p className="text-primary text-sm font-medium uppercase tracking-wider mb-2">Tech Blog</p>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
          All Articles
        </h1>
        <p className="text-gray-400 max-w-xl">
          Deep-dive reviews, how-tos, and breaking tech news. {total} articles and counting.
        </p>
      </div>

      {/* Search */}
      <div className="mb-8 max-w-xl">
        <SearchBar placeholder="Search all articles…" />
      </div>

      {/* Filters */}
      <BlogFilters
        categories={categories}
        activeCategory={activeCategory}
        activeSort={activeSort}
      />

      {/* Grid */}
      {posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 stagger">
            {posts.map(post => (
              <PostCard key={post._id.toString()} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <a
                  key={p}
                  href={`/blog?page=${p}${activeCategory ? `&category=${activeCategory}` : ''}${activeSort !== 'newest' ? `&sort=${activeSort}` : ''}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                    p === page
                      ? 'bg-primary text-black'
                      : 'bg-dark-card border border-dark-border text-gray-400 hover:text-white hover:border-primary/30'
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
          <p className="text-xl mb-2">No articles found</p>
          <p className="text-sm">Try a different category or check back later.</p>
        </div>
      )}
    </div>
  )
}

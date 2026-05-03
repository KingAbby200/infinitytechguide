import { connectDB } from '@/lib/mongoose'
import Post from '@/models/Post'
import PostCard from '@/components/blog/PostCard'
import SearchBar from '@/components/blog/SearchBar'

export async function generateMetadata({ searchParams }) {
  const q = searchParams?.q || ''
  return { title: q ? `Search: "${q}"` : 'Search' }
}

export default async function SearchPage({ searchParams }) {
  const q = searchParams?.q?.trim() || ''
  let posts = []
  let total = 0

  if (q) {
    await connectDB()
    const results = await Post.find({
      status: 'published',
      $text:  { $search: q },
    })
      .populate('author',   'name avatar')
      .populate('category', 'name slug')
      .sort({ score: { $meta: 'textScore' } })
      .limit(24)
      .lean()

    posts = results
    total = results.length
  }

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="font-display font-bold text-3xl text-white mb-6">
          {q ? `Results for "${q}"` : 'Search'}
        </h1>
        <div className="max-w-xl">
          <SearchBar defaultValue={q} autoFocus={!q} placeholder="Search articles, reviews, gadgets…" />
        </div>
      </div>

      {q && (
        <p className="text-gray-500 text-sm mb-6">
          {total === 0 ? 'No results found.' : `Found ${total} article${total !== 1 ? 's' : ''}`}
        </p>
      )}

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
          {posts.map(post => (
            <PostCard key={post._id.toString()} post={post} />
          ))}
        </div>
      ) : q ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg mb-2">No articles found for {q}</p>
          <p className="text-sm">Try different keywords or browse all posts.</p>
          <a href="/blog" className="mt-4 inline-block text-primary hover:underline text-sm">Browse all articles →</a>
        </div>
      ) : null}
    </div>
  )
}
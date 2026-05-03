import Link from 'next/link'
import { format } from 'date-fns'
import { HiClock } from 'react-icons/hi'

export default function RecommendedPosts({ posts }) {
  if (!posts || posts.length === 0) return null

  return (
    <section className="mt-16">
      <h2 className="font-display font-bold text-xl text-white mb-6 flex items-center gap-3">
        <span className="w-1 h-6 bg-primary rounded-full inline-block" />
        Recommended Readings
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {posts.map(post => (
          <Link
            key={post._id.toString()}
            href={`/blog/${post.slug}`}
            className="flex gap-4 p-4 bg-dark-card border border-dark-border rounded-xl hover:border-primary/30 transition-all group"
          >
            {post.headingImage && (
              <img
                src={post.headingImage}
                alt={post.title}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
              />
            )}
            <div className="flex flex-col justify-center min-w-0">
              <h3 className="text-sm font-medium text-gray-200 group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-1">
                {post.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                {post.readingTime && (
                  <span className="flex items-center gap-1">
                    <HiClock size={10} /> {post.readingTime}m read
                  </span>
                )}
                {post.publishedAt && (
                  <span>{format(new Date(post.publishedAt), 'MMM d, yyyy')}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
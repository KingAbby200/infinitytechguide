import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { connectDB } from '@/lib/mongoose'
import Post from '@/models/Post'
import RecommendedPosts from '@/components/blog/RecommendedPosts'
import NewsletterSignup from '@/components/blog/NewsletterSignup'
import SocialShareLinks from '@/components/blog/SocialShareLinks'
import ViewTracker from '@/components/blog/ViewTracker'
import PostActions from '@/components/blog/PostActions'
import { HiClock, HiEye, HiCalendar, HiUser } from 'react-icons/hi'

export async function generateMetadata({ params }) {
  await connectDB()
  const post = await Post.findOne({ slug: params.slug, status: 'published' }).lean()
  if (!post) return { title: 'Post Not Found' }

  return {
    title:       post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      title:       post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images:      [{ url: post.metaImage || post.headingImage }],
      type:        'article',
      publishedTime: post.publishedAt,
    },
    twitter: {
      card:  'summary_large_image',
      title: post.metaTitle || post.title,
    },
    keywords: post.tags?.join(', '),
  }
}

export default async function PostPage({ params }) {
  await connectDB()

  const post = await Post.findOne({ slug: params.slug, status: 'published' })
    .populate('author',      'name avatar bio')
    .populate('category',    'name slug')
    .populate('subcategory', 'name slug')
    .lean()

  if (!post) notFound()

  // Recommended: same category & subcategory preferred, fallback to same category
  const recommended = await Post.find({
    status:   'published',
    category: post.category._id,
    _id:      { $ne: post._id },
  })
    .populate('author', 'name')
    .sort({ publishedAt: -1 })
    .limit(4)
    .lean()

  const dateStr = post.publishedAt
    ? format(new Date(post.publishedAt), 'MMMM d, yyyy')
    : null

  return (
    <article className="pt-24 pb-20">
      <ViewTracker slug={post.slug} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <a href="/blog" className="hover:text-primary transition-colors">Blog</a>
          <span>/</span>
          {post.category && (
            <>
              <a href={`/blog?category=${post.category.slug}`} className="hover:text-primary transition-colors">
                {post.category.name}
              </a>
              {post.subcategory && <span>/</span>}
            </>
          )}
          {post.subcategory && (
            <span className="text-gray-400">{post.subcategory.name}</span>
          )}
        </nav>

        {/* Category badges */}
        <div className="flex flex-wrap gap-2 mb-5">
          {post.category && (
            <a href={`/blog?category=${post.category.slug}`} className="tag">
              {post.category.name}
            </a>
          )}
          {post.subcategory && (
            <span className="px-3 py-1 rounded-full text-xs bg-dark-card border border-dark-border text-gray-400">
              {post.subcategory.name}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-6">
          {post.title}
        </h1>

        {/* Meta bar */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-6 text-sm text-gray-500">
          {/* Author */}
          <div className="flex items-center gap-2">
            {post.author?.avatar ? (
              <img src={post.author.avatar} alt={post.author.name} className="w-7 h-7 rounded-full object-cover" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                {post.author?.name?.[0]?.toUpperCase()}
              </div>
            )}
            <span className="flex items-center gap-1"><HiUser size={13} /> {post.author?.name}</span>
          </div>

          {dateStr && (
            <span className="flex items-center gap-1"><HiCalendar size={13} /> {dateStr}</span>
          )}
          <span className="flex items-center gap-1"><HiClock size={13} /> {post.readingTime} min read</span>
          {post.views > 0 && (
            <span className="flex items-center gap-1"><HiEye size={13} /> {post.views.toLocaleString()} views</span>
          )}
        </div>

        {/* Social + Edit/Delete for admin/author */}
        <div className="flex items-center justify-between mb-8">
          <SocialShareLinks />
          <PostActions postId={post._id.toString()} authorId={post.author?._id?.toString()} />
        </div>

        {/* Heading image */}
        <div className="rounded-2xl overflow-hidden mb-10 aspect-video bg-dark-muted">
          <img
            src={post.headingImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div
          className="tiptap-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Author bio */}
        {post.author?.bio && (
          <div className="mt-12 p-6 bg-dark-card border border-dark-border rounded-2xl flex gap-4">
            {post.author.avatar ? (
              <img src={post.author.avatar} alt={post.author.name} className="w-14 h-14 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl font-bold flex-shrink-0">
                {post.author.name?.[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-medium text-white mb-1">{post.author.name}</p>
              <p className="text-gray-400 text-sm leading-relaxed">{post.author.bio}</p>
            </div>
          </div>
        )}

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-dark-border">
            <span className="text-gray-500 text-sm mr-1">Tags:</span>
            {post.tags.map(tag => (
              <a
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="px-3 py-1 rounded-full text-xs bg-dark-card border border-dark-border text-gray-400 hover:text-primary hover:border-primary/30 transition-all"
              >
                #{tag}
              </a>
            ))}
          </div>
        )}

        {/* Newsletter */}
        <NewsletterSignup />

        {/* Recommended */}
        <RecommendedPosts posts={recommended} />
      </div>
    </article>
  )
}
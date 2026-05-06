import Link from 'next/link'
import { connectDB } from '@/lib/mongoose'
import Post from '@/models/Post'
import Product from '@/models/Product'
import PostCard from '@/components/blog/PostCard'
import GadgetCard from '@/components/shop/GadgetCard'
import NewsletterSignup from '@/components/blog/NewsletterSignup'
import { HiArrowRight, HiLightningBolt, HiShoppingCart } from 'react-icons/hi'

async function getHomeData() {
  await connectDB()
  const [recentPosts, featuredProducts] = await Promise.all([
    Post.find({ status: 'published' })
      .populate('author', 'name avatar')
      .populate('category', 'name slug')
      .sort({ publishedAt: -1 })
      .limit(6)
      .lean(),
    Product.find({ inStock: true })
      .sort({ featured: -1, createdAt: -1 })
      .limit(4)
      .lean(),
  ])
  return { recentPosts, featuredProducts }
}

export default async function HomePage() {
  const { recentPosts, featuredProducts } = await getHomeData()

  return (
    <div className="pt-16">

      {/* ══════════════════════════════════════════
          HERO
          Dark:  deep black bg, white text
          Light: clean white bg, dark text + green accents
      ══════════════════════════════════════════ */}
      <section className="hero-section relative min-h-[90vh] flex items-center justify-center overflow-hidden">

        {/* Grid overlay — dark: visible, light: very subtle */}
        <div className="absolute inset-0 hero-grid pointer-events-none" />

        {/* Green radial glow */}
        <div className="absolute inset-0 hero-glow pointer-events-none" />

        {/* Bottom fade into page background */}
        <div className="absolute bottom-0 inset-x-0 h-32 hero-fade pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 text-center py-24 z-10">

          {/* Eyebrow pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in">
            <HiLightningBolt size={14} />
            Your Gateway to the Tech Universe
          </div>

          {/* Headline — uses hero-heading class for theme-aware colour */}
          <h1 className="hero-heading font-display font-bold text-5xl sm:text-6xl lg:text-7xl mb-6 leading-tight animate-slide-up">
            The Future of{' '}
            <span className="text-primary relative">
              Technology
              <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
            </span>
            {' '}is Here
          </h1>

          {/* Sub-headline */}
          <p className="hero-sub text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
            Expert gadget reviews, deep-dive tech guides, and the freshest products —
            all in one place built for true tech enthusiasts.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Link
              href="/blog"
              className="btn-primary px-8 py-3 rounded-xl text-base flex items-center gap-2 shadow-glow"
            >
              Read the Blog <HiArrowRight size={18} />
            </Link>
            <Link
              href="/shop"
              className="hero-btn-secondary px-8 py-3 rounded-xl text-base flex items-center gap-2 border transition-all hover:border-primary/40"
            >
              <HiShoppingCart size={18} className="text-primary" /> Shop Gadgets
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-16 text-sm animate-fade-in" style={{ animationDelay: '400ms' }}>
            {[
              { value: recentPosts.length + '+',     label: 'Published Posts' },
              { value: featuredProducts.length + '+', label: 'Gadgets In Stock' },
              { value: '100%',                        label: 'Honest Reviews' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-display font-bold text-primary">{stat.value}</div>
                <div className="hero-stat-label mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          RECENT POSTS
      ══════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-primary text-sm font-medium mb-2 uppercase tracking-wider">Latest from the blog</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl section-heading">Recent Posts</h2>
          </div>
          <Link href="/blog" className="hidden sm:flex items-center gap-2 text-primary text-sm font-medium transition-colors hover:opacity-80">
            View all <HiArrowRight size={16} />
          </Link>
        </div>

        {recentPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
            {recentPosts.map(post => (
              <PostCard key={post._id.toString()} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 section-muted">
            <p className="text-lg">No posts published yet. Check back soon!</p>
          </div>
        )}

        <div className="text-center mt-10 sm:hidden">
          <Link href="/blog" className="btn-primary px-6 py-2.5 rounded-lg text-sm inline-flex items-center gap-2">
            View all posts <HiArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-dark-border to-transparent" />
      </div>

      {/* ══════════════════════════════════════════
          FEATURED SHOP
      ══════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-primary text-sm font-medium mb-2 uppercase tracking-wider">Tech store</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl section-heading">Featured Gadgets</h2>
          </div>
          <Link href="/shop" className="hidden sm:flex items-center gap-2 text-primary text-sm font-medium transition-colors hover:opacity-80">
            Shop all <HiArrowRight size={16} />
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
            {featuredProducts.map(product => (
              <GadgetCard key={product._id.toString()} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 section-muted">
            <p className="text-lg">Products coming soon!</p>
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="py-20">
        <NewsletterSignup hero />
      </section>
    </div>
  )
}

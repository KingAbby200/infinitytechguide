import { connectDB } from '@/lib/mongoose'
import Post from '@/models/Post'
import User from '@/models/User'
import Product from '@/models/Product'
import { Subscriber } from '@/models/Newsletter'
import Link from 'next/link'
import { HiDocumentText, HiUsers, HiShoppingBag, HiMail, HiClock, HiEye, HiArrowRight } from 'react-icons/hi'
import { format } from 'date-fns'

async function getStats() {
  await connectDB()
  const [
    totalPosts, publishedPosts, pendingPosts,
    totalAuthors, totalProducts, totalSubscribers,
    recentPosts, topPosts,
  ] = await Promise.all([
    Post.countDocuments(),
    Post.countDocuments({ status: 'published' }),
    Post.countDocuments({ status: 'pending' }),
    User.countDocuments({ role: 'author' }),
    Product.countDocuments(),
    Subscriber.countDocuments({ active: true }),
    Post.find().populate('author', 'name').sort({ createdAt: -1 }).limit(5).lean(),
    Post.find({ status: 'published' }).sort({ views: -1 }).limit(5).lean(),
  ])
  return { totalPosts, publishedPosts, pendingPosts, totalAuthors, totalProducts, totalSubscribers, recentPosts, topPosts }
}

export default async function AdminDashboard() {
  const { totalPosts, publishedPosts, pendingPosts, totalAuthors, totalProducts, totalSubscribers, recentPosts, topPosts } = await getStats()

  const STATS = [
    { label: 'Total Posts',    value: totalPosts,        sub: `${publishedPosts} published`,   icon: HiDocumentText, href: '/admin/posts',      color: 'text-primary' },
    { label: 'Pending Review', value: pendingPosts,       sub: 'awaiting approval',              icon: HiClock,        href: '/admin/posts?status=pending', color: 'text-yellow-400' },
    { label: 'Authors',        value: totalAuthors,       sub: 'active accounts',                icon: HiUsers,        href: '/admin/users',      color: 'text-blue-400' },
    { label: 'Products',       value: totalProducts,      sub: 'in the shop',                    icon: HiShoppingBag,  href: '/admin/shop',       color: 'text-purple-400' },
    { label: 'Subscribers',    value: totalSubscribers,   sub: 'newsletter subscribers',         icon: HiMail,         href: '/admin/newsletter', color: 'text-pink-400' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-bold text-2xl text-white">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {STATS.map(stat => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-dark-card border border-dark-border rounded-xl p-5 hover:border-primary/20 transition-all group card-hover"
          >
            <div className="flex items-start justify-between mb-3">
              <stat.icon size={22} className={`${stat.color} opacity-80`} />
              <HiArrowRight size={15} className="text-gray-600 group-hover:text-primary transition-colors" />
            </div>
            <p className={`font-display font-bold text-3xl ${stat.color} mb-1`}>{stat.value}</p>
            <p className="text-white text-sm font-medium">{stat.label}</p>
            <p className="text-gray-600 text-xs mt-0.5">{stat.sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent activity */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-white">Recent Posts</h2>
            <Link href="/admin/posts" className="text-primary text-xs hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentPosts.map(post => (
              <div key={post._id.toString()} className="flex items-center gap-3">
                {post.headingImage && (
                  <img src={post.headingImage} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm line-clamp-1">{post.title}</p>
                  <p className="text-gray-600 text-xs">{post.author?.name} · {format(new Date(post.createdAt), 'MMM d')}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0 ${
                  post.status === 'published' ? 'badge-published' :
                  post.status === 'pending'   ? 'badge-pending'   :
                  post.status === 'rejected'  ? 'badge-rejected'  : 'badge-draft'
                }`}>
                  {post.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top posts */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-white">Top Posts by Views</h2>
          </div>
          <div className="space-y-3">
            {topPosts.length === 0 ? (
              <p className="text-gray-600 text-sm">No published posts yet.</p>
            ) : topPosts.map((post, i) => (
              <div key={post._id.toString()} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-dark-muted flex items-center justify-center text-xs text-gray-500 flex-shrink-0 font-medium">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm line-clamp-1">{post.title}</p>
                </div>
                <span className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                  <HiEye size={12} /> {post.views.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      {pendingPosts > 0 && (
        <div className="flex items-center gap-4 p-4 bg-yellow-400/5 border border-yellow-400/20 rounded-xl">
          <HiClock size={20} className="text-yellow-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-white text-sm font-medium">{pendingPosts} post{pendingPosts !== 1 ? 's' : ''} waiting for review</p>
            <p className="text-gray-400 text-xs">Review and approve or reject pending submissions.</p>
          </div>
          <Link href="/admin/posts?status=pending" className="px-4 py-2 rounded-lg bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-sm hover:bg-yellow-400/20 transition-all whitespace-nowrap">
            Review now
          </Link>
        </div>
      )}
    </div>
  )
}
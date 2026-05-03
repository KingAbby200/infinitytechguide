import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { HiClock, HiEye } from 'react-icons/hi'

export default function PostCard({ post }) {
  const date = post.publishedAt ? format(new Date(post.publishedAt), 'MMM d, yyyy') : null

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col bg-dark-card border border-dark-border rounded-2xl overflow-hidden card-hover animate-fade-in"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-dark-muted">
        {post.headingImage ? (
          <img
            src={post.headingImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-dark-muted to-dark-border flex items-center justify-center">
            <span className="text-4xl opacity-20">∞</span>
          </div>
        )}
        {/* Category badge */}
        {post.category && (
          <span className="absolute top-3 left-3 tag text-[11px]">
            {post.category.name}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-display font-semibold text-white text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>

        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
          {post.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-2">
            {post.author?.avatar ? (
              <img src={post.author.avatar} alt={post.author.name} className="w-5 h-5 rounded-full object-cover" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[9px] font-bold">
                {post.author?.name?.[0]?.toUpperCase()}
              </div>
            )}
            <span className="text-gray-500">{post.author?.name}</span>
          </div>

          <div className="flex items-center gap-3">
            {post.readingTime && (
              <span className="flex items-center gap-1">
                <HiClock size={11} /> {post.readingTime}m
              </span>
            )}
            {post.views > 0 && (
              <span className="flex items-center gap-1">
                <HiEye size={11} /> {post.views.toLocaleString()}
              </span>
            )}
            {date && <span>{date}</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}
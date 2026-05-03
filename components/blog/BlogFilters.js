'use client'
import { useRouter, useSearchParams } from 'next/navigation'

const SORTS = [
  { value: 'newest',  label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'oldest',  label: 'Oldest' },
]

export default function BlogFilters({ categories, activeCategory, activeSort }) {
  const router      = useRouter()
  const searchParams = useSearchParams()

  function navigate(key, value) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', '1')
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/blog?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => navigate('category', '')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            !activeCategory
              ? 'bg-primary text-black'
              : 'bg-dark-card border border-dark-border text-gray-400 hover:text-white hover:border-primary/30'
          }`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat._id}
            onClick={() => navigate('category', cat.slug)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat.slug
                ? 'bg-primary text-black'
                : 'bg-dark-card border border-dark-border text-gray-400 hover:text-white hover:border-primary/30'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="ml-auto">
        <select
          value={activeSort}
          onChange={e => navigate('sort', e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-dark-card border border-dark-border text-gray-300 text-sm focus:outline-none focus:border-primary/50"
        >
          {SORTS.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
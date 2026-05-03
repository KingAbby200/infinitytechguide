'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { HiSearch } from 'react-icons/hi'

export default function SearchBar({ defaultValue = '', placeholder = 'Search posts…', autoFocus = false }) {
  const [query, setQuery] = useState(defaultValue)
  const router = useRouter()

  function handleSubmit(e) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    router.push(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center">
      <HiSearch size={18} className="absolute left-4 text-gray-500 pointer-events-none" />
      <input
        type="search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full pl-11 pr-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 text-sm transition-colors"
      />
      <button type="submit" className="sr-only">Search</button>
    </form>
  )
}
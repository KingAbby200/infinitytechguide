'use client'
import { useEffect } from 'react'

export default function ViewTracker({ slug }) {
  useEffect(() => {
    // Only count once per session per post
    const key = `viewed:${slug}`
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, '1')

    fetch(`/api/views/${slug}`, { method: 'POST' }).catch(() => {})
  }, [slug])

  return null
}
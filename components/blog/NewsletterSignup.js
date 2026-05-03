'use client'
import { useState } from 'react'
import { HiMail, HiArrowRight, HiCheckCircle } from 'react-icons/hi'

export default function NewsletterSignup({ hero = false }) {
  const [email, setEmail]     = useState('')
  const [status, setStatus]   = useState('idle') // idle | loading | success | error
  const [message, setMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res  = await fetch('/api/newsletter/subscribe', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setStatus('success')
      setMessage('You\'re subscribed! Welcome to the Infinity Tech family.')
      setEmail('')
    } catch (err) {
      setStatus('error')
      setMessage(err.message || 'Something went wrong. Please try again.')
    }
  }

  if (hero) {
    return (
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="bg-dark-card border border-dark-border rounded-3xl p-10 relative overflow-hidden">
          {/* glow */}
          <div className="absolute inset-0 bg-glow-green opacity-40 pointer-events-none" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
              <HiMail size={12} /> Newsletter
            </span>
            <h2 className="font-display font-bold text-3xl text-white mb-3">Stay in the Loop</h2>
            <p className="text-gray-400 mb-8 text-sm leading-relaxed">
              Get the latest tech reviews, gadget drops, and exclusive deals delivered straight to your inbox. No spam, ever.
            </p>
            {status === 'success' ? (
              <div className="flex items-center justify-center gap-2 text-primary font-medium">
                <HiCheckCircle size={20} /> {message}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-4 py-3 rounded-xl bg-dark border border-dark-border text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 text-sm"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary px-6 py-3 rounded-xl text-sm flex items-center gap-2 justify-center whitespace-nowrap disabled:opacity-60"
                >
                  {status === 'loading' ? 'Subscribing…' : <><span>Subscribe</span><HiArrowRight size={16} /></>}
                </button>
              </form>
            )}
            {status === 'error' && (
              <p className="text-red-400 text-sm mt-3">{message}</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Inline version (end of blog post)
  return (
    <div className="mt-16 p-8 bg-dark-card border border-dark-border rounded-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-glow-green opacity-30 pointer-events-none" />
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="flex-1">
          <h3 className="font-display font-semibold text-white text-lg mb-1">Enjoyed this post?</h3>
          <p className="text-gray-400 text-sm">Subscribe to get more tech content delivered to your inbox.</p>
        </div>
        {status === 'success' ? (
          <div className="flex items-center gap-2 text-primary text-sm font-medium">
            <HiCheckCircle size={18} /> Subscribed!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 w-full sm:w-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="px-3 py-2 rounded-lg bg-dark border border-dark-border text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 text-sm w-full sm:w-48"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-primary px-4 py-2 rounded-lg text-sm whitespace-nowrap disabled:opacity-60"
            >
              {status === 'loading' ? '…' : 'Subscribe'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
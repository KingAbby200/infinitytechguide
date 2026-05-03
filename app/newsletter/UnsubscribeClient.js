'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { HiCheckCircle, HiXCircle } from 'react-icons/hi'

export default function UnsubscribeClient() {
  const searchParams = useSearchParams()
  const token        = searchParams.get('token')
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    if (!token) { setStatus('error'); return }
    fetch(`/api/newsletter/unsubscribe?token=${token}`)
      .then(r => r.json())
      .then(d => setStatus(d.ok ? 'success' : 'error'))
      .catch(() => setStatus('error'))
  }, [token])

  if (status === 'loading') {
    return <p className="text-gray-400">Processing your request…</p>
  }

  if (status === 'success') {
    return (
      <div className="animate-fade-in">
        <HiCheckCircle size={56} className="text-primary mx-auto mb-4" />
        <h1 className="font-display font-bold text-2xl text-white mb-3">You've been unsubscribed</h1>
        <p className="text-gray-400 mb-8">You won't receive any more newsletters from us. We're sorry to see you go!</p>
        <Link href="/" className="btn-primary px-6 py-3 rounded-xl text-sm">Back to Homepage</Link>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <HiXCircle size={56} className="text-red-400 mx-auto mb-4" />
      <h1 className="font-display font-bold text-2xl text-white mb-3">Invalid Link</h1>
      <p className="text-gray-400 mb-8">This unsubscribe link is invalid or has already been used.</p>
      <Link href="/" className="text-primary hover:underline text-sm">Back to Homepage</Link>
    </div>
  )
}
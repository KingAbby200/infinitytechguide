import { Suspense } from 'react'
import UnsubscribeClient from './UnsubscribeClient'

export const metadata = { title: 'Unsubscribe', robots: { index: false } }

export default function UnsubscribePage() {
  return (
    <div className="pt-32 pb-20 max-w-md mx-auto px-4 text-center">
      <Suspense fallback={<p className="text-gray-400">Loading…</p>}>
        <UnsubscribeClient />
      </Suspense>
    </div>
  )
}
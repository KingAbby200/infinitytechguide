'use client'
import { Suspense } from 'react'
import SignInForm from './SignInForm'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-dark">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary text-black font-bold text-xl font-display mb-3">
            ∞
          </span>
          <h1 className="font-display font-bold text-2xl text-white">Infinity Tech Guide</h1>
          <p className="text-gray-500 text-sm mt-1">Staff sign in</p>
        </div>

        <Suspense fallback={
          <div className="bg-dark-card border border-dark-border rounded-2xl p-7 flex items-center justify-center h-48">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <SignInForm />
        </Suspense>

        <p className="text-center text-gray-600 text-xs mt-6">
          This page is for staff only and is not publicly accessible.
        </p>
      </div>
    </div>
  )
}

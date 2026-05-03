import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { HiPencil, HiPlus, HiHome } from 'react-icons/hi'

export default async function AuthorLayout({ children }) {
  const session = await getServerSession(authOptions)
  if (!session || !['admin', 'author'].includes(session.user.role)) {
    redirect('/auth/signin')
  }

  return (
    <div className="pt-16 min-h-screen bg-dark">
      {/* Sub-nav */}
      <div className="border-b border-dark-border bg-dark-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-1 py-2">
          <Link href="/author" className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all">
            <HiHome size={15} /> My Posts
          </Link>
          <Link href="/author/new" className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all">
            <HiPlus size={15} /> New Post
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </div>
    </div>
  )
}
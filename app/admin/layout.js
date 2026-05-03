import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  HiHome, HiDocumentText, HiUsers, HiTag,
  HiShoppingBag, HiMail, HiCog,
} from 'react-icons/hi'

const NAV = [
  { href: '/admin',             label: 'Dashboard',   icon: HiHome },
  { href: '/admin/posts',       label: 'Posts',       icon: HiDocumentText },
  { href: '/admin/users',       label: 'Authors',     icon: HiUsers },
  { href: '/admin/categories',  label: 'Categories',  icon: HiTag },
  { href: '/admin/shop',        label: 'Shop',        icon: HiShoppingBag },
  { href: '/admin/newsletter',  label: 'Newsletter',  icon: HiMail },
]

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') redirect('/auth/signin')

  return (
    <div className="pt-16 min-h-screen bg-dark flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 border-r border-dark-border bg-dark-card">
        <div className="p-5 border-b border-dark-border">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Admin Panel</p>
          <p className="text-white text-sm font-medium mt-1 truncate">{session.user.name}</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all group"
            >
              <Icon size={17} className="group-hover:text-primary transition-colors" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-dark-border">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-white hover:bg-white/5 transition-all">
            ← Back to site
          </Link>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="lg:hidden fixed top-16 inset-x-0 z-40 bg-dark-card border-b border-dark-border overflow-x-auto">
        <div className="flex items-center gap-0.5 px-3 py-1.5 min-w-max">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/5 whitespace-nowrap transition-all"
            >
              <Icon size={14} /> {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0 p-6 lg:p-8 mt-10 lg:mt-0">
        {children}
      </main>
    </div>
  )
}
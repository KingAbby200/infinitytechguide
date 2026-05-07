'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { useCart } from '@/lib/cartStore'
import {
  HiMenu, HiX, HiShoppingCart, HiSearch, HiChevronDown,
  HiUser, HiLogout, HiCog, HiPencil, HiSun, HiMoon,
} from 'react-icons/hi'

const NAV_LINKS = [
  { label: 'Blog',  href: '/blog' },
  { label: 'Shop',  href: '/shop' },
  { label: 'About', href: '/about' },
]

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch — only render after mount
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-9 h-9" />

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all group"
    >
      {/* Sun — shown in dark mode */}
      <HiSun
        size={18}
        className={`absolute transition-all duration-300 ${
          isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
        }`}
      />
      {/* Moon — shown in light mode */}
      <HiMoon
        size={18}
        className={`absolute transition-all duration-300 ${
          isDark ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100 text-gray-600 group-hover:text-gray-900'
        }`}
      />
    </button>
  )
}

export default function Navbar() {
  const pathname              = usePathname()
  const { data: session }     = useSession()
  const { totalItems, isOpen: cartOpen, setIsOpen } = useCart()
  const [menuOpen, setMenuOpen]   = useState(false)
  const [scrolled, setScrolled]   = useState(false)
  const [userMenu, setUserMenu]   = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false); setUserMenu(false) }, [pathname])

  const isActive = (href) => pathname === href || pathname.startsWith(href + '/')

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-dark/95 dark:bg-dark/95 light:bg-white/95 backdrop-blur-md border-b border-dark-border shadow-card'
        : 'bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-black text-sm font-display group-hover:shadow-glow transition-all">
            ∞
          </span>
          <span className="font-display font-bold text-white text-md sm:text-lg">
            Infinity<span className="text-primary">Tech</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive(link.href)
                  ? 'text-primary bg-primary/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1">
          {/* Search */}
          <Link
            href="/search"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            aria-label="Search"
          >
            <HiSearch size={18} />
          </Link>

          {/* Cart */}
          <button
            onClick={() => setIsOpen(!cartOpen)}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            aria-label="Cart"
          >
            <HiShoppingCart size={18} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* User menu */}
          {session ? (
            <div className="relative ml-1">
              <button
                onClick={() => setUserMenu(!userMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-card border border-dark-border hover:border-primary/30 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                  {session.user.name?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm text-gray-300 hidden sm:block max-w-[100px] truncate">
                  {session.user.name}
                </span>
                <HiChevronDown size={14} className={`text-gray-400 transition-transform ${userMenu ? 'rotate-180' : ''}`} />
              </button>

              {userMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-dark-card border border-dark-border rounded-xl shadow-card py-1 animate-fade-in">
                  {session.user.role === 'admin' && (
                    <Link href="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                      <HiCog size={16} className="text-primary" /> Admin Panel
                    </Link>
                  )}
                  {['admin', 'author'].includes(session.user.role) && (
                    <Link href="/author" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                      <HiPencil size={16} className="text-primary" /> My Posts
                    </Link>
                  )}
                  <hr className="border-dark-border my-1" />
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-red-400 hover:bg-white/5 transition-all"
                  >
                    <HiLogout size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : null}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            aria-label="Menu"
          >
            {menuOpen ? <HiX size={20} /> : <HiMenu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-dark/98 backdrop-blur-md border-t border-dark-border mobile-menu-enter">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.href)
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {session && (
              <>
                <hr className="border-dark-border my-2" />
                {session.user.role === 'admin' && (
                  <Link href="/admin" className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5">
                    <HiCog size={16} className="text-primary" /> Admin Panel
                  </Link>
                )}
                <Link href="/author" className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5">
                  <HiPencil size={16} className="text-primary" /> My Posts
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-white/5"
                >
                  <HiLogout size={16} /> Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

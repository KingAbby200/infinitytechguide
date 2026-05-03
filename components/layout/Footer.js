import Link from 'next/link'
import { FaXTwitter, FaTiktok, FaFacebook, FaYoutube } from 'react-icons/fa6'

const SOCIAL = [
  { icon: FaXTwitter,  href: process.env.NEXT_PUBLIC_TWITTER_URL  || '#', label: 'X / Twitter' },
  { icon: FaTiktok,    href: process.env.NEXT_PUBLIC_TIKTOK_URL   || '#', label: 'TikTok' },
  { icon: FaFacebook,  href: process.env.NEXT_PUBLIC_FACEBOOK_URL || '#', label: 'Facebook' },
  { icon: FaYoutube,   href: process.env.NEXT_PUBLIC_YOUTUBE_URL  || '#', label: 'YouTube' },
]

const LINKS = {
  'Blog': [
    { label: 'All Posts',     href: '/blog' },
    { label: 'Categories',    href: '/blog' },
    { label: 'Latest News',   href: '/blog' },
  ],
  'Shop': [
    { label: 'All Gadgets',   href: '/shop' },
    { label: 'Cart',          href: '/shop/cart' },
  ],
  'Company': [
    { label: 'About Us',      href: '/about' },
    { label: 'Privacy Policy',href: '/privacy-policy' },
    { label: 'Contact',       href: '/about#contact' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-dark-border bg-dark-card mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center font-bold text-black font-display">∞</span>
              <span className="font-display font-bold text-white text-xl">
                Infinity<span className="text-primary">Tech</span> Guide
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Your ultimate destination for the latest tech gadgets, honest reviews,
              and cutting-edge news from across the digital universe.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-6">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-dark-muted border border-dark-border flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/30 transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">
                {section}
              </h3>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-500 hover:text-primary text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-dark-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} Infinity Tech Guide. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
            <span>·</span>
            <span className="flex items-center gap-1">
              Built with <span className="text-primary">♥</span> for tech lovers
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
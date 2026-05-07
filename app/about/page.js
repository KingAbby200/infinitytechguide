import { FaXTwitter, FaTiktok, FaWhatsapp } from 'react-icons/fa6'
import NewsletterSignup from '@/components/blog/NewsletterSignup'

export const metadata = {
  title: 'About Us',
  description: 'Learn about Infinity Tech Guide — your ultimate source for honest tech reviews and the latest gadgets.',
}

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Hero */}
        <div className="text-center mb-20">
          <span className="inline-flex w-20 h-20 rounded-3xl bg-primary items-center justify-center font-display font-bold text-4xl text-black mb-6 shadow-glow">∞</span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">About Infinity Tech Guide</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            We're a team of tech enthusiasts passionate about cutting through the noise to bring you honest,
            in-depth gadget reviews and the latest technology news.
          </p>
        </div>

        {/* Mission */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            { emoji: '🔍', title: 'Honest Reviews',     desc: 'We tell it like it is. No paid promotions, no sugar-coating — just genuine opinions you can trust.' },
            { emoji: '⚡', title: 'Latest Tech',         desc: 'From smartphones to smart homes, we cover everything at the cutting edge of technology.' },
            { emoji: '🛒', title: 'Curated Shop',        desc: 'We only list products we believe in — handpicked gadgets at competitive prices.' },
          ].map(item => (
            <div key={item.title} className="bg-dark-card border border-dark-border rounded-2xl p-6 text-center hover:border-primary/20 transition-all">
              <div className="text-4xl mb-4">{item.emoji}</div>
              <h3 className="font-display font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Social */}
        <div id="contact" className="bg-dark-card border border-dark-border rounded-3xl p-10 text-center mb-16">
          <h2 className="font-display font-bold text-2xl text-white mb-3">Follow Us</h2>
          <p className="text-gray-400 mb-8">Stay connected for the latest tech content across all platforms.</p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { Icon: FaXTwitter,  href: process.env.NEXT_PUBLIC_TWITTER_URL  || 'https://x.com/infintygadgets',  label: 'X / Twitter', bg: 'hover:bg-black' },
              { Icon: FaTiktok,    href: process.env.NEXT_PUBLIC_TIKTOK_URL   || 'https://www.tiktok.com/@infinity.gadget4',   label: 'TikTok',      bg: 'hover:bg-[#010101]' },
              { Icon: FaWhatsapp,  href: process.env.NEXT_PUBLIC_WHATSAPP_URL  || 'https://t.co/1dGaD9Zzcr', label: 'Whatsapp',    bg: 'hover:bg-[#1877F2]' },
            ].map(({ Icon, href, label, bg }) => (
              <a
                key={label}
                href={href || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 px-6 py-3 rounded-xl bg-dark border border-dark-border text-gray-300 hover:text-white hover:border-transparent ${bg} transition-all`}
              >
                <Icon size={20} /> {label}
              </a>
            ))}
          </div>
        </div>

        {/* Privacy note */}
        <p className="text-center text-gray-600 text-sm">
          Read our{' '}
          <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>
          {' '}to understand how we handle your data.
        </p>
      </div>

      <div className="mt-16">
        <NewsletterSignup hero />
      </div>
    </div>
  )
}

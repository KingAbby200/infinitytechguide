import { FaXTwitter, FaTiktok, FaFacebook, FaYoutube } from 'react-icons/fa6'

const SOCIALS = [
  { Icon: FaXTwitter, key: 'NEXT_PUBLIC_TWITTER_URL',  label: 'X / Twitter', color: 'hover:text-[#1DA1F2]' },
  { Icon: FaTiktok,   key: 'NEXT_PUBLIC_TIKTOK_URL',   label: 'TikTok',      color: 'hover:text-[#ff0050]' },
  { Icon: FaFacebook, key: 'NEXT_PUBLIC_FACEBOOK_URL', label: 'Facebook',    color: 'hover:text-[#1877F2]' },
  { Icon: FaYoutube,  key: 'NEXT_PUBLIC_YOUTUBE_URL',  label: 'YouTube',     color: 'hover:text-[#FF0000]' },
]

export default function SocialShareLinks() {
  return (
    <div className="flex items-center gap-3 my-6">
      <span className="text-gray-500 text-sm">Follow us:</span>
      {SOCIALS.map(({ Icon, key, label, color }) => {
        const href = process.env[key] || '#'
        return (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={`w-8 h-8 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center text-gray-400 ${color} hover:border-white/20 transition-all`}
          >
            <Icon size={15} />
          </a>
        )
      })}
    </div>
  )
}
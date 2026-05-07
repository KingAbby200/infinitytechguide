import './globals.css'
import { ThemeProvider } from 'next-themes'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { CartProvider } from '@/lib/cartStore'
import SessionWrapper from '@/components/layout/SessionWrapper'

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default:  'Infinity Tech Guide',
    template: '%s | Infinity Tech Guide',
  },
  description: 'Your ultimate guide to the latest tech gadgets, reviews, and news from across the galaxy.',
  icons: { icon: './icon.png' },
  keywords: ['tech', 'gadgets', 'reviews', 'technology', 'smartphones', 'laptops', 'electronics'],
  authors: [{ name: 'Infinity Tech Guide' }],
  openGraph: {
    type:     'website',
    locale:   'en_US',
    siteName: 'Infinity Tech Guide',
    images: ['./icon.png'],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index:  true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-dark dark:bg-dark text-gray-200 dark:text-gray-200 min-h-screen flex flex-col antialiased transition-colors duration-300">
        <SessionWrapper>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <CartProvider>
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </CartProvider>
          </ThemeProvider>
        </SessionWrapper>
      </body>
    </html>
  )
}

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Infinity Tech Guide.',
}

export default function PrivacyPolicyPage() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Infinity Tech Guide'
  const siteUrl  = process.env.NEXT_PUBLIC_SITE_URL  || 'https://infinitytechguide.com'

  return (
    <div className="pt-24 pb-20 max-w-3xl mx-auto px-4 sm:px-6">
      <h1 className="font-display font-bold text-3xl text-white mb-2">Privacy Policy</h1>
      <p className="text-gray-500 text-sm mb-10">Last updated: {new Date().getFullYear()}</p>

      <div className="tiptap-content space-y-6 text-gray-300">

        <p>This Privacy Policy describes how <strong>{siteName}</strong> ("<strong>we</strong>", "<strong>our</strong>", or "<strong>us</strong>") collects, uses, and shares information about you when you visit <a href={siteUrl}>{siteUrl}</a>.</p>

        <h2>1. Information We Collect</h2>
        <p><strong>Newsletter subscriptions:</strong> When you subscribe to our newsletter, we collect your email address. This is used solely to send you newsletters and updates from {siteName}.</p>
        <p><strong>Log data:</strong> Like most websites, we collect standard log data including your IP address, browser type, pages visited, and time spent on the site. This data is used for analytics and site improvement.</p>
        <p><strong>Cookies:</strong> We use cookies to remember your preferences (such as dark mode) and to support site functionality. We may also use third-party cookies for analytics and advertising purposes (see Google AdSense below).</p>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To deliver newsletter emails you have subscribed to</li>
          <li>To analyse site traffic and improve our content</li>
          <li>To personalise your experience on our site</li>
          <li>To display relevant advertisements via Google AdSense</li>
        </ul>

        <h2>3. Google AdSense & Third-Party Advertising</h2>
        <p>We use Google AdSense to display advertisements. Google may use cookies and web beacons to collect data about your visits to this and other websites to show you personalised advertisements. You can opt out of personalised advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google's Ad Settings</a>.</p>

        <h2>4. Third-Party Services</h2>
        <p>We use the following third-party services which may collect data according to their own privacy policies:</p>
        <ul>
          <li><strong>Cloudinary</strong> — for image hosting and delivery</li>
          <li><strong>Google Analytics</strong> — for site analytics (if enabled)</li>
          <li><strong>Google AdSense</strong> — for advertising</li>
        </ul>

        <h2>5. Data Retention</h2>
        <p>Newsletter subscriber emails are retained until you unsubscribe. You can unsubscribe at any time using the link at the bottom of any newsletter email, or by contacting us directly.</p>

        <h2>6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you</li>
          <li>Request correction or deletion of your data</li>
          <li>Unsubscribe from our newsletter at any time</li>
          <li>Opt out of personalised advertising</li>
        </ul>
        <p>To exercise any of these rights, please contact us at the email address on our About page.</p>

        <h2>7. Cookies Policy</h2>
        <p>We use essential cookies required for site functionality, as well as optional cookies for analytics and advertising. By continuing to use this site, you consent to our use of cookies as described in this policy.</p>

        <h2>8. Children's Privacy</h2>
        <p>This website is not directed at children under 13 years of age. We do not knowingly collect personal information from children.</p>

        <h2>9. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated date.</p>

        <h2>10. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please visit our <a href="/about#contact">About page</a> for contact information.</p>
      </div>
    </div>
  )
}
import { connectDB } from '@/lib/mongoose'
import { Subscriber, Campaign } from '@/models/Newsletter'
import NewsletterComposer from '@/components/admin/NewsletterComposer'

export const metadata = { title: 'Admin — Newsletter' }

export default async function AdminNewsletterPage() {
  await connectDB()
  const [subscribers, campaigns] = await Promise.all([
    Subscriber.countDocuments({ active: true }),
    Campaign.find().sort({ createdAt: -1 }).limit(20).lean(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-white">Newsletter</h1>
        <p className="text-gray-500 text-sm mt-1">
          <span className="text-primary font-medium">{subscribers}</span> active subscribers
        </p>
      </div>
      <NewsletterComposer campaigns={JSON.parse(JSON.stringify(campaigns))} />
    </div>
  )
}
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongoose'
import { Subscriber, Campaign } from '@/models/Newsletter'
import { sendBulkEmail, unsubscribeFooter } from '@/lib/email'

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await connectDB()
  const { subject, htmlContent, campaignId } = await req.json()

  if (!subject || !htmlContent) {
    return NextResponse.json({ error: 'Subject and content are required' }, { status: 400 })
  }

  const subscribers = await Subscriber.find({ active: true }).lean()

  if (subscribers.length === 0) {
    return NextResponse.json({ error: 'No active subscribers' }, { status: 400 })
  }

  const baseUrl   = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const recipients = subscribers.map(sub => ({
    email: sub.email,
    html:  htmlContent + unsubscribeFooter(sub.token, baseUrl),
  }))

  const results = await sendBulkEmail({ recipients, subject, batchSize: 20, delayMs: 1000 })

  // Save or update campaign record
  if (campaignId) {
    await Campaign.findByIdAndUpdate(campaignId, {
      status:         'sent',
      sentAt:         new Date(),
      recipientCount: results.sent,
      failedCount:    results.failed,
    })
  } else {
    await Campaign.create({
      subject,
      htmlContent,
      status:         'sent',
      sentAt:         new Date(),
      recipientCount: results.sent,
      failedCount:    results.failed,
    })
  }

  return NextResponse.json(results)
}

// Save a draft campaign
export async function PUT(req) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await connectDB()
  const { id, subject, htmlContent } = await req.json()

  if (id) {
    const c = await Campaign.findByIdAndUpdate(id, { subject, htmlContent }, { new: true })
    return NextResponse.json(c)
  } else {
    const c = await Campaign.create({ subject, htmlContent, status: 'draft' })
    return NextResponse.json(c, { status: 201 })
  }
}

// Get all campaigns
export async function GET(req) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await connectDB()
  const campaigns = await Campaign.find().sort({ createdAt: -1 }).lean()
  return NextResponse.json(campaigns)
}
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { Subscriber } from '@/models/Newsletter'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Invalid unsubscribe link' }, { status: 400 })
  }

  await connectDB()
  const sub = await Subscriber.findOneAndUpdate(
    { token },
    { active: false },
    { new: true }
  )

  if (!sub) {
    return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
  }

  return NextResponse.json({ ok: true, message: 'You have been unsubscribed.' })
}
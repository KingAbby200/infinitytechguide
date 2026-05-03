import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { Subscriber } from '@/models/Newsletter'
import crypto from 'crypto'

export async function POST(req) {
  await connectDB()
  const { email } = await req.json()

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
  }

  const token = crypto.randomBytes(32).toString('hex')

  await Subscriber.findOneAndUpdate(
    { email: email.toLowerCase() },
    { email: email.toLowerCase(), active: true, token },
    { upsert: true, new: true }
  )

  return NextResponse.json({ ok: true, message: 'Subscribed successfully!' })
}
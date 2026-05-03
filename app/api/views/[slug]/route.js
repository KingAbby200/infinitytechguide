import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import Post from '@/models/Post'

export async function POST(req, { params }) {
  await connectDB()
  await Post.findOneAndUpdate(
    { slug: params.slug, status: 'published' },
    { $inc: { views: 1 } }
  )
  return NextResponse.json({ ok: true })
}
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongoose'
import Post from '@/models/Post'
import slugify from 'slugify'
import { calculateReadingTime, generateExcerpt } from '@/lib/readingTime'

export async function GET(req, { params }) {
  await connectDB()
  const post = await Post.findById(params.id)
    .populate('author',      'name avatar bio')
    .populate('category',    'name slug')
    .populate('subcategory', 'name slug')
    .lean()

  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(post)
}

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const post = await Post.findById(params.id)
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const isAdmin  = session.user.role === 'admin'
  const isAuthor = post.author.toString() === session.user.id

  if (!isAdmin && !isAuthor) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()

  // Authors cannot change status
  if (!isAdmin) {
    delete body.status
    delete body.rejectionReason
  }

  // If being published for the first time
  if (body.status === 'published' && !post.publishedAt) {
    body.publishedAt = new Date()
  }

  // Recalculate reading time if content changed
  if (body.content) {
    body.readingTime = calculateReadingTime(body.content)
    if (!body.excerpt) body.excerpt = generateExcerpt(body.content)
  }

  // Regenerate slug if title changed (admin only to avoid breaking URLs)
  if (isAdmin && body.title && body.title !== post.title) {
    let baseSlug = slugify(body.title, { lower: true, strict: true })
    let slug     = baseSlug
    let counter  = 1
    while (await Post.findOne({ slug, _id: { $ne: params.id } })) {
      slug = `${baseSlug}-${counter++}`
    }
    body.slug = slug
  }

  const updated = await Post.findByIdAndUpdate(params.id, body, { new: true })
    .populate('author',      'name avatar')
    .populate('category',    'name slug')
    .populate('subcategory', 'name slug')
    .lean()

  return NextResponse.json(updated)
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const post = await Post.findById(params.id)
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const isAdmin  = session.user.role === 'admin'
  const isAuthor = post.author.toString() === session.user.id

  if (!isAdmin && !isAuthor) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await Post.findByIdAndDelete(params.id)
  return NextResponse.json({ ok: true })
}
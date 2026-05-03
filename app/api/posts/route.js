import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongoose'
import Post from '@/models/Post'
import Category from '@/models/Category'
import slugify from 'slugify'
import { calculateReadingTime, generateExcerpt } from '@/lib/readingTime'

export async function GET(req) {
  await connectDB()
  const { searchParams } = new URL(req.url)

  const status    = searchParams.get('status') || 'published'
  const category  = searchParams.get('category')
  const author    = searchParams.get('author')
  const q         = searchParams.get('q')
  const page      = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit     = Math.min(50, parseInt(searchParams.get('limit') || '12'))
  const sort      = searchParams.get('sort') || 'newest'

  const query = {}

  // Auth-gated: non-published statuses require session
  const session = await getServerSession(authOptions)
  if (status !== 'published') {
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.user.role === 'author') {
      query.author = session.user.id
    }
  }
  query.status = status

  if (category) query.category = category
  if (author)   query.author   = author
  if (q)        query.$text    = { $search: q }

  const sortMap = {
    newest:  { publishedAt: -1 },
    oldest:  { publishedAt:  1 },
    popular: { views: -1 },
  }

  const [posts, total] = await Promise.all([
    Post.find(query)
      .populate('author',      'name avatar')
      .populate('category',    'name slug')
      .populate('subcategory', 'name slug')
      .sort(sortMap[sort] || sortMap.newest)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Post.countDocuments(query),
  ])

  return NextResponse.json({
    posts,
    total,
    pages: Math.ceil(total / limit),
    page,
  })
}

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()

  try {
    const body = await req.json()
    const {
      title, content, headingImage,
      categoryId, subcategoryId,
      tags, excerpt,
      metaTitle, metaDescription, metaImage,
      newCategoryName, newSubcategoryName,
    } = body

    if (!title || !content || !headingImage || !categoryId) {
      return NextResponse.json({ error: 'Title, content, heading image, and category are required' }, { status: 400 })
    }

    // Handle admin creating new categories on the fly
    let resolvedCategoryId = categoryId
    let resolvedSubcategoryId = subcategoryId || null

    if (categoryId === '__new__' && newCategoryName && session.user.role === 'admin') {
      const slug = slugify(newCategoryName, { lower: true, strict: true })
      const existing = await Category.findOne({ slug })
      if (existing) {
        resolvedCategoryId = existing._id.toString()
      } else {
        const newCat = await Category.create({ name: newCategoryName, slug })
        resolvedCategoryId = newCat._id.toString()
      }
    }

    if (subcategoryId === '__new__' && newSubcategoryName && session.user.role === 'admin') {
      const slug = slugify(newSubcategoryName, { lower: true, strict: true })
      const existing = await Category.findOne({ slug })
      if (existing) {
        resolvedSubcategoryId = existing._id.toString()
      } else {
        const newSub = await Category.create({
          name:   newSubcategoryName,
          slug,
          parent: resolvedCategoryId,
        })
        resolvedSubcategoryId = newSub._id.toString()
      }
    }

    // Generate a unique slug
    let baseSlug = slugify(title, { lower: true, strict: true })
    let slug     = baseSlug
    let counter  = 1
    while (await Post.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`
    }

    const readingTime    = calculateReadingTime(content)
    const autoExcerpt    = excerpt || generateExcerpt(content)
    const isAdmin        = session.user.role === 'admin'
    const status         = isAdmin ? 'published' : 'pending'

    const post = await Post.create({
      title,
      slug,
      headingImage,
      content,
      excerpt:         autoExcerpt,
      readingTime,
      author:          session.user.id,
      category:        resolvedCategoryId,
      subcategory:     resolvedSubcategoryId,
      tags:            Array.isArray(tags) ? tags.map(t => t.trim().toLowerCase()).filter(Boolean) : [],
      status,
      metaTitle:       metaTitle       || title,
      metaDescription: metaDescription || autoExcerpt,
      metaImage:       metaImage       || headingImage,
      publishedAt:     isAdmin ? new Date() : null,
    })

    const populated = await Post.findById(post._id)
      .populate('author',   'name avatar')
      .populate('category', 'name slug')
      .lean()

    return NextResponse.json(populated, { status: 201 })
  } catch (err) {
    console.error('Post create error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
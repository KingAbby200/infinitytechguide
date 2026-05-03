import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongoose'
import Product from '@/models/Product'
import slugify from 'slugify'

export async function GET(req) {
  await connectDB()
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')
  const page     = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit    = Math.min(50, parseInt(searchParams.get('limit') || '12'))

  const query = {}
  if (category)          query.category = category
  if (featured === '1')  query.featured = true

  const [products, total] = await Promise.all([
    Product.find(query)
      .sort({ featured: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Product.countDocuments(query),
  ])

  return NextResponse.json({ products, total, pages: Math.ceil(total / limit) })
}

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await connectDB()
  const body = await req.json()
  const { name, description, price, images, category, brand, inStock, featured, specs } = body

  if (!name || price == null) {
    return NextResponse.json({ error: 'Name and price are required' }, { status: 400 })
  }

  let slug    = slugify(name, { lower: true, strict: true })
  let counter = 1
  while (await Product.findOne({ slug })) slug = `${slugify(name, { lower: true, strict: true })}-${counter++}`

  const product = await Product.create({
    name, slug, description, price,
    images:   images   || [],
    category: category || '',
    brand:    brand    || '',
    inStock:  inStock  !== false,
    featured: featured || false,
    specs:    specs    || {},
  })

  return NextResponse.json(product, { status: 201 })
}
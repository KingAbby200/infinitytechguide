import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongoose'
import Category from '@/models/Category'
import slugify from 'slugify'

export async function GET() {
  await connectDB()
  const categories = await Category.find()
    .populate('parent', 'name slug')
    .sort({ order: 1, name: 1 })
    .lean()
  return NextResponse.json(categories)
}

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await connectDB()
  const { name, description, parent, order } = await req.json()

  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 })

  const slug = slugify(name, { lower: true, strict: true })
  const existing = await Category.findOne({ slug })
  if (existing) return NextResponse.json({ error: 'Category already exists' }, { status: 409 })

  const category = await Category.create({
    name,
    slug,
    description,
    parent: parent || null,
    order:  order  || 0,
  })

  return NextResponse.json(category, { status: 201 })
}
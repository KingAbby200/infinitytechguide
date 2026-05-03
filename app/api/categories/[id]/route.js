import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongoose'
import Category from '@/models/Category'
import slugify from 'slugify'

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await connectDB()
  const { name, description, parent, order } = await req.json()
  const updates = { description, parent: parent || null, order }

  if (name) {
    updates.name = name
    updates.slug = slugify(name, { lower: true, strict: true })
  }

  const category = await Category.findByIdAndUpdate(params.id, updates, { new: true })
  if (!category) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(category)
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await connectDB()
  // Also delete all subcategories
  await Category.deleteMany({ parent: params.id })
  await Category.findByIdAndDelete(params.id)

  return NextResponse.json({ ok: true })
}
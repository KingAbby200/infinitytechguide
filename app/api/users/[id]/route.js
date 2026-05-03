import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongoose'
import User from '@/models/User'

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await connectDB()
  const user = await User.findById(params.id)
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (user.role === 'admin') {
    return NextResponse.json({ error: 'Cannot delete admin accounts' }, { status: 400 })
  }

  await User.findByIdAndDelete(params.id)
  return NextResponse.json({ ok: true })
}

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await connectDB()
  const { name, bio, password } = await req.json()
  const updates = {}
  if (name) updates.name = name
  if (bio  !== undefined) updates.bio = bio

  // If resetting password
  if (password) {
    const user = await User.findById(params.id)
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    user.password = password
    await user.save()
    if (Object.keys(updates).length > 0) {
      await User.findByIdAndUpdate(params.id, updates)
    }
    return NextResponse.json({ ok: true })
  }

  const user = await User.findByIdAndUpdate(params.id, updates, { new: true }).select('-password').lean()
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(user)
}
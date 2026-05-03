import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongoose'
import User from '@/models/User'

export async function GET(req) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await connectDB()
  const users = await User.find({ role: 'author' })
    .select('-password')
    .sort({ createdAt: -1 })
    .lean()

  return NextResponse.json(users)
}

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await connectDB()
  const { name, email, password, bio } = await req.json()

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 })
  }

  const existing = await User.findOne({ email: email.toLowerCase() })
  if (existing) {
    return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: 'author',
    bio:  bio || '',
  })

  const { password: _, ...safeUser } = user.toObject()
  return NextResponse.json(safeUser, { status: 201 })
}
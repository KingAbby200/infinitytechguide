/**
 * Seed Admin Script
 * Run with: node scripts/seed-admin.js
 * Requires .env.local to be configured.
 */

const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

async function main() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error('❌  MONGODB_URI not set in .env.local')
    process.exit(1)
  }

  const email    = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    console.error('❌  ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local')
    process.exit(1)
  }

  console.log('Connecting to MongoDB…')
  await mongoose.connect(uri)
  console.log('Connected.')

  const UserSchema = new mongoose.Schema({
    name:     String,
    email:    { type: String, unique: true, lowercase: true },
    password: String,
    role:     { type: String, default: 'author' },
    bio:      String,
    avatar:   String,
    isActive: { type: Boolean, default: true },
  }, { timestamps: true })

  const User = mongoose.models.User || mongoose.model('User', UserSchema)

  const existing = await User.findOne({ email: email.toLowerCase() })
  if (existing) {
    console.log(`✅  Admin account already exists: ${email}`)
    await mongoose.disconnect()
    return
  }

  const hashed = await bcrypt.hash(password, 12)
  await User.create({
    name:     'Admin',
    email:    email.toLowerCase(),
    password: hashed,
    role:     'admin',
  })

  console.log(`\n✅  Admin account created!`)
  console.log(`    Email:    ${email}`)
  console.log(`    Sign in at: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/signin`)
  console.log(`\n⚠️   Keep your .env.local credentials safe and never commit them to git.\n`)

  await mongoose.disconnect()
}

main().catch(err => {
  console.error('Seed error:', err.message)
  process.exit(1)
})
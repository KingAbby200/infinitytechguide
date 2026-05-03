import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
      match:     [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type:     String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
    },
    role: {
      type:    String,
      enum:    ['admin', 'author'],
      default: 'author',
    },
    bio:    { type: String, maxlength: 400 },
    avatar: { type: String },
    socialLinks: {
      twitter:   String,
      instagram: String,
      website:   String,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

UserSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password)
}

// Don't return password in queries by default
UserSchema.set('toJSON', {
  transform(doc, ret) {
    delete ret.password
    return ret
  },
})

export default mongoose.models.User || mongoose.model('User', UserSchema)
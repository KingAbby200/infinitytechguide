import mongoose from 'mongoose'

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Category name is required'],
      trim:     true,
    },
    slug: {
      type:     String,
      required: true,
      unique:   true,
      lowercase: true,
    },
    description: { type: String, maxlength: 300 },
    parent: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     'Category',
      default: null,
    },
    image:  { type: String },
    order:  { type: Number, default: 0 },
  },
  { timestamps: true }
)

CategorySchema.index({ slug: 1 })
CategorySchema.index({ parent: 1 })

export default mongoose.models.Category || mongoose.model('Category', CategorySchema)
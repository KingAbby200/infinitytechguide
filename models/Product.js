import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type:      String,
      required:  [true, 'Product name is required'],
      trim:      true,
      maxlength: [150, 'Name too long'],
    },
    slug: {
      type:     String,
      required: true,
      unique:   true,
      lowercase: true,
    },
    description: { type: String, maxlength: 1000 },
    price: {
      type:     Number,
      required: [true, 'Price is required'],
      min:      [0, 'Price cannot be negative'],
    },
    images: [{ type: String }],
    category:  { type: String, trim: true },
    brand:     { type: String, trim: true },
    inStock:   { type: Boolean, default: true },
    featured:  { type: Boolean, default: false },
    specs:     { type: Map, of: String },
  },
  { timestamps: true }
)

ProductSchema.index({ slug: 1 })
ProductSchema.index({ featured: 1 })
ProductSchema.index({ category: 1 })

export default mongoose.models.Product || mongoose.model('Product', ProductSchema)
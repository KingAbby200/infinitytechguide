import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema(
  {
    title: {
      type:     String,
      required: [true, 'Title is required'],
      trim:     true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type:      String,
      required:  true,
      unique:    true,
      lowercase: true,
    },
    headingImage: {
      type:     String,
      required: [true, 'A heading image is required'],
    },
    content: {
      type:     String,
      required: [true, 'Content is required'],
    },
    excerpt: {
      type:      String,
      required:  [true, 'Excerpt is required'],
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    },
    author: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    category: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Category',
      required: [true, 'Category is required'],
    },
    subcategory: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     'Category',
      default: null,
    },
    tags: [{ type: String, trim: true, lowercase: true }],
    status: {
      type:    String,
      enum:    ['draft', 'pending', 'published', 'rejected'],
      default: 'pending',
    },
    rejectionReason: { type: String },
    views:       { type: Number, default: 0 },
    readingTime: { type: Number, default: 1 },
    // SEO / Open Graph
    metaTitle:       { type: String },
    metaDescription: { type: String },
    metaImage:       { type: String },
    publishedAt:     { type: Date },
  },
  { timestamps: true }
)

PostSchema.index({ slug: 1 })
PostSchema.index({ status: 1, publishedAt: -1 })
PostSchema.index({ category: 1, status: 1 })
PostSchema.index({ author: 1 })
PostSchema.index({ tags: 1 })
PostSchema.index({ title: 'text', excerpt: 'text', tags: 'text' })

export default mongoose.models.Post || mongoose.model('Post', PostSchema)
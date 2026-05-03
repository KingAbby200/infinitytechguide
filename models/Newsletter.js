import mongoose from 'mongoose'

const SubscriberSchema = new mongoose.Schema(
  {
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
      match:     [/^\S+@\S+\.\S+$/, 'Invalid email'],
    },
    active: { type: Boolean, default: true },
    token:  { type: String },        // unsubscribe token
  },
  { timestamps: true }
)

const CampaignSchema = new mongoose.Schema(
  {
    subject:        { type: String, required: true },
    htmlContent:    { type: String, required: true },
    sentAt:         { type: Date },
    recipientCount: { type: Number, default: 0 },
    failedCount:    { type: Number, default: 0 },
    status:         { type: String, enum: ['draft', 'sent'], default: 'draft' },
  },
  { timestamps: true }
)

export const Subscriber =
  mongoose.models.Subscriber || mongoose.model('Subscriber', SubscriberSchema)

export const Campaign =
  mongoose.models.Campaign || mongoose.model('Campaign', CampaignSchema)
import { Schema, model, Types } from 'mongoose'

export const AddonSchema = new Schema(
  {
    item_id: {
      type: Types.ObjectId,
      ref: 'Item',
      required: true,
      index: true
    },

    name: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    is_active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

AddonSchema.index({ item_id: 1, name: 1 }, { unique: true })

export const AddonModel = model('Addon', AddonSchema)

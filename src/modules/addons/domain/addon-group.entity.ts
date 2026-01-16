import { Schema, model, Types } from 'mongoose'

export const AddonGroupSchema = new Schema(
  {
    item_id: {
      type: Types.ObjectId,
      ref: 'Item',
      required: true
    },

    name: {
      type: String,
      required: true
    },

    required: {
      type: Boolean,
      default: false
    },

    min: {
      type: Number,
      default: 0
    },

    max: {
      type: Number,
      default: 1
    },

    addon_ids: [
      {
        type: Types.ObjectId,
        ref: 'Addon'
      }
    ],

    is_active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

export const AddonGroupModel = model('AddonGroup', AddonGroupSchema)

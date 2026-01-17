import { Schema, model, Document, Types } from 'mongoose'

export type PricingType =
  | 'STATIC'
  | 'TIERED'
  | 'COMPLIMENTARY'
  | 'DISCOUNTED'
  | 'DYNAMIC'

export interface ItemDocument extends Document {
  parent_type: 'CATEGORY' | 'SUBCATEGORY'
  parent_id: Types.ObjectId

  name: string
  description?: string
  image?: string

  pricing: {
    type: PricingType
    config: any
  }

  tax_applicable?: boolean
  tax_percentage?: number

  availability?: any
  addons?: any[]

  is_active: boolean
}

const ItemSchema = new Schema<ItemDocument>(
  {
    parent_type: {
      type: String,
      enum: ['CATEGORY', 'SUBCATEGORY'],
      required: true
    },
    parent_id: {
      type: Schema.Types.ObjectId,
      required: true,
      
    },

    name: {
      type: String,
      required: true,
      trim: true
    },
    description: String,
    image: String,

    pricing: {
      type: {
        type: String,
        enum: [
          'STATIC',
          'TIERED',
          'COMPLIMENTARY',
          'DISCOUNTED',
          'DYNAMIC'
        ],
        required: true
      },
      config: {
        type: Schema.Types.Mixed,
        required: true
      }
    },

    tax_applicable: Boolean,
    tax_percentage: {
      type: Number,
      min: 0,
      max: 100
    },

    availability: {
      days: [String],
      slots: [
        {
          start: String,
          end: String
        }
      ]
    },

    addons: [
      {
        name: String,
        price: Number,
        is_mandatory: Boolean,
        group_name: String
      }
    ],

    is_active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

ItemSchema.index(
  { parent_id: 1, name: 1 },
  { unique: true }
)

ItemSchema.index({ name: 'text' })

export const ItemModel = model<ItemDocument>('Item', ItemSchema)

import { Schema, model, Document, Types } from 'mongoose'

export interface SubcategoryDocument extends Document {
  category_id: Types.ObjectId
  name: string
  image?: string
  description?: string

  tax_applicable?: boolean
  tax_percentage?: number

  is_active: boolean
}

const SubcategorySchema = new Schema<SubcategoryDocument>(
  {
    category_id: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },
    image: String,
    description: String,

    tax_applicable: Boolean,
    tax_percentage: {
      type: Number,
      min: 0,
      max: 100
    },

    is_active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

SubcategorySchema.index(
  { category_id: 1, name: 1 },
  { unique: true }
)

export const SubcategoryModel = model<SubcategoryDocument>(
  'Subcategory',
  SubcategorySchema
)

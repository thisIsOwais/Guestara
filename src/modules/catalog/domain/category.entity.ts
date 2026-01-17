import { Schema, model, Document } from 'mongoose'

export interface CategoryDocument extends Document {
  name: string
  image?: string
  description?: string

  tax_applicable: boolean
  tax_percentage?: number

  is_active: boolean
  createdAt: Date
  updatedAt: Date
}

const CategorySchema = new Schema<CategoryDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    image: String,
    description: String,

    tax_applicable: {
      type: Boolean,
      default: false
    },
    
    tax_percentage: {
      type: Number,
      min: 0,
      max: 100,
      required: function () {
        return (this as any).tax_applicable
      }
    },

    is_active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

CategorySchema.index({ name: 1 }, { unique: true })

export const CategoryModel = model<CategoryDocument>(
  'Category',
  CategorySchema
)

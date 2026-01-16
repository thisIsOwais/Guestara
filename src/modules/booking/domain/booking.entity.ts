import { Schema, model, Document, Types } from 'mongoose'

export interface BookingDocument extends Document {
  item_id: Types.ObjectId
  date: Date
  slot: {
    start: string
    end: string
  }

  addons_selected?: any[]

  pricing_snapshot: {
    base_price: number
    discount?: number
    tax: number
    final_price: number
  }

  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
}

const BookingSchema = new Schema<BookingDocument>(
  {
    item_id: {
      type: Schema.Types.ObjectId,
      ref: 'Item',
      required: true
    },

    date: {
      type: Date,
      required: true
    },

    slot: {
      start: String,
      end: String
    },

    addons_selected: [
      {
        name: String,
        price: Number
      }
    ],

    pricing_snapshot: {
      base_price: Number,
      discount: Number,
      tax: Number,
      final_price: Number
    },

    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
      default: 'PENDING'
    }
  },
  { timestamps: true }
)

BookingSchema.index(
  { item_id: 1, date: 1, 'slot.start': 1 },
  { unique: true }
)

export const BookingModel = model<BookingDocument>(
  'Booking',
  BookingSchema
)

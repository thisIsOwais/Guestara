import mongoose from 'mongoose'
import { ItemModel } from '../../modules/catalog/domain/item.entity'

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI as string
   
    if (!uri) {
      throw new Error('MONGODB_URI not defined')
    }

    await mongoose.connect(uri)

    await ItemModel.syncIndexes()

    console.log('✅ MongoDB connected')
  } catch (error) {
    console.log(error)
    console.error('❌ MongoDB connection failed')
    process.exit(1)
  }
}

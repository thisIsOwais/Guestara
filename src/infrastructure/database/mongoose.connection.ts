import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI as string

    if (!uri) {
      throw new Error('MONGODB_URI not defined')
    }

    await mongoose.connect(uri)

    console.log('✅ MongoDB connected')
  } catch (error) {
    console.error('❌ MongoDB connection failed')
    process.exit(1)
  }
}

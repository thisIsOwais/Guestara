import 'dotenv/config'
import {app} from './app'
import { connectDB } from './infrastructure/database/mongoose.connection'

const PORT = process.env.PORT || 4000

const startServer = async () => {
  await connectDB()

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
  })
}

startServer()

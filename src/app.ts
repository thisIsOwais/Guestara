import express, { Application, Request, Response, NextFunction } from 'express'
import createHttpError from 'http-errors'
import { BaseError,ValidationError } from './shared/index'
import itemRoutes from './modules/catalog/api/item.routes'

// import { ValidationError } from './shared/errors/index'
export const app: Application = express()

// ===== MIDDLEWARES =====
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ===== HEALTH CHECK =====
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'Guestara backend is running'
  })
})

// ===== error-test=====
app.get('/error-test', () => {
  throw new ValidationError('Invalid input provided')
})
app.use('/items', itemRoutes)
  

// ===== API ROUTES (future) =====
// app.use('/api/catalog', catalogRoutes)
// app.use('/api/pricing', pricingRoutes)
// app.use('/api/booking', bookingRoutes)

// ===== 404 HANDLER =====
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(createHttpError(404, 'Route not found'))
})

// ===== GLOBAL ERROR HANDLER =====
app.use(
    (
      err: any,
      _req: Request,
      res: Response,
      _next: NextFunction
    ) => {
      if (err instanceof BaseError) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message
        })
      }
  
      console.error(err)
  
      res.status(500).json({
        success: false,
        message: 'Internal Server Error'
      })
    }
  )
  

  
import { Response,Request, Router } from 'express'
import { asyncHandler } from '../../../shared/utils/async-handler'
import { listCategories } from '../services/category.service'

const router = Router()

router.get(
  '/',
  asyncHandler(async (req:Request, res:Response) => {
    const result = await listCategories(req.query)
    res.json(result)
  })
)

export default router

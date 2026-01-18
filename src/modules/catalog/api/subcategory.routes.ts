import { Response,Request, Router } from 'express'
import { asyncHandler } from '../../../shared/utils/async-handler'
import { listSubcategories } from '../services/subcategory.service'

const router = Router()

router.get(
  '/categories/:categoryId/subcategories',
  asyncHandler(async (req:Request, res:Response) => {
    const data = await listSubcategories(
      req.params.categoryId as string,
      req.query
    )
    res.json({ data })
  })
)

export default router

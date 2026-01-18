import { Response,Request, Router } from 'express'
import { asyncHandler } from '../../../shared/utils/async-handler'
import { listItems } from '../services/item.service'
import { getPrice } from '../services/item-pricing.service'

const router = Router();



router.get(
  '/',
  asyncHandler(async (req:Request, res:Response) => {
    const result = await listItems(req.query)
    res.json(result)
  })
)

router.get(
  '/:id/price',
  asyncHandler(getPrice)
)

export default router
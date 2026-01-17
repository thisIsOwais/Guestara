import { Router } from 'express'
import { asyncHandler } from '../../../shared/utils/async-handler'
import { getItemPrice } from '../services/item-pricing.service'

const router = Router()

router.get('/:id/price', asyncHandler(getItemPrice))

export default router

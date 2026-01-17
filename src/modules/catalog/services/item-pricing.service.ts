import { Request, Response } from 'express'
import { ItemModel } from '../domain/item.entity'
import { SubcategoryModel } from '../domain/subcategory.entity'
import { CategoryModel } from '../domain/category.entity'
import { PricingEngineService } from '../../pricing/services/pricing-engine.service'
import { NotFoundError } from '../../../shared/errors/not-found.error'

const pricingEngine = new PricingEngineService()

export const getItemPrice = async (req: Request, res: Response) => {
  const { id } = req.params

  const item = await ItemModel.findOne({
    _id: id,
    is_active: true
  })

  if (!item) {
    throw new NotFoundError('Item')
  }

  let category = null
  let subcategory = null

  if (item.parent_type === 'SUBCATEGORY') {
    subcategory = await SubcategoryModel.findOne({
      _id: item.parent_id,
      is_active: true
    })

    if (!subcategory) {
      throw new NotFoundError('Subcategory')
    }

    category = await CategoryModel.findOne({
      _id: subcategory.category_id,
      is_active: true
    })
  }

  if (item.parent_type === 'CATEGORY') {
    category = await CategoryModel.findOne({
      _id: item.parent_id,
      is_active: true
    })
  }

  if (!category) {
    throw new NotFoundError('Category')
  }

  // // Context for pricing strategies
  // const context = {
  //   quantity: Number(req.query.quantity) || 1,
  //   time: req.query.time || new Date().toISOString().slice(11, 16) // HH:mm
  // }

const context = {
    quantity: Number(req.query.quantity) || 1,
    time: (req.query.time as string) || '10:00',
    addon_ids: req.query.addons
      ? (req.query.addons as string).split(',')
      : []
  }
  

  const priceResult = pricingEngine.calculatePrice({
    item,
    subcategory,
    category,
    context
  })

  res.json({
    success: true,
    item_id: item._id,
    ...priceResult
  })
}

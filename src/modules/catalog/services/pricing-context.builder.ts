import { ItemModel } from '../domain/item.entity'
import { CategoryModel } from '../domain/category.entity'
import { SubcategoryModel } from '../domain/subcategory.entity'
import { NotFoundError } from '../../../shared/errors/not-found.error'

export class PricingContextBuilder {
  static async build(itemId: string) {
    const item = await ItemModel.findOne({
      _id: itemId,
      is_active: true
    })

    if (!item) throw new NotFoundError('Item')

    let category = null
    let subcategory = null

    if (item.parent_type === 'SUBCATEGORY') {
      subcategory = await SubcategoryModel.findOne({
        _id: item.parent_id,
        is_active: true
      })

      if (!subcategory) throw new NotFoundError('Subcategory')

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

    if (!category) throw new NotFoundError('Category')

    return { item, category, subcategory }
  }
}

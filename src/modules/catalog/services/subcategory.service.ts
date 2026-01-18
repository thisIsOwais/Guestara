import { SubcategoryModel } from '../domain/subcategory.entity'
import { buildPagination,buildSort } from '../../../shared/utils/query-builder'
export const listSubcategories = async (
  categoryId: string,
  query: any
) => {
  const { skip, limit } = buildPagination(query)
  const sort = buildSort(query)

  const filter = {
    category_id: categoryId,
    is_active: true
  }

  const data = await SubcategoryModel.find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sort)

  return data
}

import { CategoryModel } from '../domain/category.entity'
import { buildPagination,buildSort } from '../../../shared/utils/query-builder'

export const listCategories = async (query: any) => {
  const { skip, limit } = buildPagination(query)
  const sort = buildSort(query)

  const data = await CategoryModel.find({ is_active: true })
    .skip(skip)
    .limit(limit)
    .sort(sort)

  const total = await CategoryModel.countDocuments({ is_active: true })

  return { data, total }
}

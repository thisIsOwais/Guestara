import { ParsedQs } from 'qs'
import { SortOrder } from 'mongoose'

export const buildPagination = (query: ParsedQs) => {
  const page = Math.max(Number(query.page) || 1, 1)
  const limit = Math.min(Number(query.limit) || 10, 100)
  const skip = (page - 1) * limit

  return { page, limit, skip }
}


export const buildSort = (
    query: ParsedQs
  ): Record<string, SortOrder> => {
    const allowed = ['name', 'createdAt', 'price']
    const sortBy = allowed.includes(query.sort as string)
      ? (query.sort as string)
      : 'createdAt'
  
    const order: SortOrder =
      query.order === 'asc' ? 1 : -1
  
    return { [sortBy]: order }
  }
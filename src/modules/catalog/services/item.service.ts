// // import { ItemModel } from '../domain/item.entity'
// // import { buildPagination,buildSort } from '../../../shared/utils/query-builder'

// // export const listItems = async (query: any) => {
// //   const { skip, limit } = buildPagination(query)
// //   const sort = buildSort(query)

// //   const filter: any = {}

// //   if (query.active === 'true') {
// //     filter.is_active = true
// //   }

// //   if (query.tax_applicable) {
// //     filter.tax_applicable = query.tax_applicable === 'true'
// //   }

// //   if (query.search) {
// //     filter.$text = { $search: query.search }
// //   }

// //   if (query.category) {
// //     filter.parent_type = 'CATEGORY'
// //     filter.parent_id = query.category
// //   }

// //   if (query.price_min || query.price_max) {
// //     filter['pricing.config.price'] = {}
// //     if (query.price_min)
// //       filter['pricing.config.price'].$gte = Number(query.price_min)
// //     if (query.price_max)
// //       filter['pricing.config.price'].$lte = Number(query.price_max)
// //   }

// //   console.log(filter);
// //   console.log(skip);
// //   console.log(limit);
// //   console.log(sort);

// //   const data = await ItemModel.find(filter)
// //     .skip(skip)
// //     .limit(limit).sort(sort)

 
// //     console.log(data);

// //   const total = await ItemModel.find(filter)

// //   return { data, total }
// // }


// import { ItemModel } from '../domain/item.entity'
// import { buildPagination, buildSort } from '../../../shared/utils/query-builder'
// import { Types } from 'mongoose'

// export const listItems = async (query: any) => {
//   const { skip, limit } = buildPagination(query)
//   const sort = buildSort(query)

//   const filter: any = {}

//   /* ---------------- ACTIVE ---------------- */
//   if (query.active === 'true') {
//     filter.is_active = true
//   }

//   /* ---------------- TAX ---------------- */
//   if (query.tax_applicable !== undefined) {
//     filter.tax_applicable = query.tax_applicable === 'true'
//   }

//   /* ---------------- SEARCH ---------------- */
//   if (query.search) {
//     // $text unreliable for partial search → regex fallback
//     filter.name = { $regex: query.search, $options: 'i' }
//   }

//   /* ---------------- CATEGORY ---------------- */
//   if (query.category) {
//     filter.parent_type = 'CATEGORY'
//     filter.parent_id = new Types.ObjectId(query.category)
//   }

//   /* ---------------- SUBCATEGORY ---------------- */
//   if (query.subcategory) {
//     filter.parent_type = 'SUBCATEGORY'
//     filter.parent_id = new Types.ObjectId(query.subcategory)
//   }

//   /* ---------------- PRICE FILTER ---------------- */
//   if (query.price_min || query.price_max) {
//     filter['pricing.config.price'] = {}

//     if (query.price_min) {
//       filter['pricing.config.price'].$gte = Number(query.price_min)
//     }

//     if (query.price_max) {
//       filter['pricing.config.price'].$lte = Number(query.price_max)
//     }
//   }

//   /* ---------------- QUERY ---------------- */
//   const data = await ItemModel.find(filter)
//     .sort(sort)
//     .skip(skip)
//     .limit(limit)
//     .select({
//       name: 1,
//       image: 1,
//       pricing: 1,
//       tax_applicable: 1,
//       is_active: 1,
//       availability: 1,
//       createdAt: 1
//     })
//     .lean()

//   /* ---------------- TOTAL COUNT ---------------- */
//   const total = await ItemModel.countDocuments(filter)

//   return {
//     data,
//     meta: {
//       page: Math.floor(skip / limit) + 1,
//       limit,
//       total
//     }
//   }
// }

import { Types } from 'mongoose'
import { ItemModel } from '../domain/item.entity'
import { CategoryModel } from '../domain/category.entity'
import { SubcategoryModel } from '../domain/subcategory.entity'
import { PricingEngineService } from '../../pricing/services/pricing-engine.service'
import { buildPagination } from '../../../shared/utils/query-builder'
import { Request } from 'express'

const pricingEngine = new PricingEngineService()

export const listItems = async (query: any) => {
  const { skip, limit } = buildPagination(query)

  /* --------------------------------------------------
     1️⃣ DB-LEVEL FILTERS (NO PRICE HERE)
  -------------------------------------------------- */
  const dbFilter: any = {}

  // Active only
  if (query.active === 'true') {
    dbFilter.is_active = true
  }

  // Tax applicable
  if (query.tax_applicable !== undefined) {
    dbFilter.tax_applicable = query.tax_applicable === 'true'
  }

  // Partial text search (SAFE)
  const sanitizeSearch = (val: any) =>
    String(val).replace(/\s+/g, ' ').trim()
  
  if (query.search) {
    dbFilter.name = {
      $regex: sanitizeSearch(query.search),
      $options: 'i'
    }
  }

  
  // Category filter
  if (query.category) {
      dbFilter.parent_type = 'CATEGORY'
      dbFilter.parent_id = new Types.ObjectId(query.category)
    }
    
    // Subcategory filter
    if (query.subcategory) {
        dbFilter.parent_type = 'SUBCATEGORY'
        dbFilter.parent_id = new Types.ObjectId(query.subcategory)
    }
    
  /* --------------------------------------------------
     2️⃣ FETCH CANDIDATE ITEMS
  -------------------------------------------------- */
//   const rawItems = await ItemModel.find({ name: { $regex: 'conf', $options: 'i' } }) // default
  const rawItems = await ItemModel.find(dbFilter) // default
    .lean()

  const activeItems= rawItems.filter((item)=>{

    return item.is_active;
  })

   
  /* --------------------------------------------------
     3️⃣ RESOLVE PRICE (ALL PRICING TYPES)
  -------------------------------------------------- */
  const resolvedItems = await Promise.all(
    activeItems.map(async (item) => {
      let category = null
      let subcategory = null

      if (item.parent_type === 'SUBCATEGORY') {
        subcategory = await SubcategoryModel.findById(item.parent_id).lean()
        if (subcategory) {
          category = await CategoryModel.findById(
            subcategory.category_id
          ).lean()
        }
      }

      if (item.parent_type === 'CATEGORY') {
        category = await CategoryModel.findById(item.parent_id).lean()
      }

      const pricing = pricingEngine.calculatePrice({
        item,
        category,
        subcategory,
        context: {
          quantity: Number(query.quantity) || 1,
          time: query.time || '10:00'
        }
      })


      return {
        ...item,
        resolved_price: pricing.final_price,
        pricing_breakdown: pricing?pricing: null
      }
    })
  )

  /* --------------------------------------------------
     4️⃣ PRICE FILTER (CRITICAL)
  -------------------------------------------------- */
  let filtered = resolvedItems

  console.log("before filtering data.......",filtered)

  if (query.price_min) {
    filtered = filtered.filter(
      (i) => i.resolved_price >= Number(query.price_min)
    )
  }

  if (query.price_max) {
    filtered = filtered.filter(
      (i) => i.resolved_price <= Number(query.price_max)
    )
  }

  // 4️⃣ TIME FILTER (CRITICAL)
  if (query.time || query.day) 
  { 

    const timeToMinutes = (time: string): number => {
      const [h, m] = time.split(':').map(Number)
      return h * 60 + m
    } 

    const queryTime = timeToMinutes(query.time)
    console.log(queryTime)
    console.log("time filter.......",query.day,query.time)
    const timeFiltered = filtered.filter((item:any)=>
      { 
        const temp=item.availability; 
        console.log(temp)
        if(temp.days.includes(query.day) && temp.slots.some((slot:any)=> {
          console.log( timeToMinutes(slot.start), queryTime , timeToMinutes(slot.end) , queryTime)
          return timeToMinutes(slot.start) <= queryTime && timeToMinutes(slot.end) >= queryTime
        }
      )
      )
          { 

            console.log("matched")
            return true; 

        } 
      } 
    )
    console.log(timeFiltered)
    }
    // )
    // const timeToMinutes = (time: string): number => {
    //   const [h, m] = time.split(':').map(Number)
    //   return h * 60 + m
    // } 
    // const queryTime = timeToMinutes(query.time)
   
    
// const timeFiltered = filtered.filter((item: any) => {
//   return item.availability?.some((avail: any) =>
//     avail.days.includes(query.day) &&
//     avail.slots.some((slot: any) => {
//       const start = timeToMinutes(slot.start)
//       const end = timeToMinutes(slot.end)
//       return queryTime >= start && queryTime <= end
//     })
//   )
// })

//     console.log(timeFiltered)
//   }
    
  

  
  /* --------------------------------------------------
     5️⃣ SORTING
  -------------------------------------------------- */
  const sortBy = query.sort_by || 'createdAt'
  const order = query.order === 'asc' ? 1 : -1



  filtered.sort((a, b) => {
    if (sortBy === 'price') {

      return order === 1
        ? a.resolved_price - b.resolved_price
        : b.resolved_price - a.resolved_price
    }

    if (sortBy === 'name') {
      return order === 1
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    }

    return order === 1
      ? new Date((a as any).createdAt).getTime() -
          new Date((b as any).createdAt).getTime()
      : new Date((b as any).createdAt).getTime() -
          new Date((a as any).createdAt).getTime()
  })

  /* --------------------------------------------------
     6️⃣ PAGINATION
  -------------------------------------------------- */
  const total = filtered.length
  const paginated = filtered.slice(skip, skip + limit)

  /* --------------------------------------------------
     7️⃣ RESPONSE
  -------------------------------------------------- */
  return {
    page: Math.floor(skip / limit) + 1,
    limit,
    total,
    data: paginated
  }
}

export const listAvailabilty= async(req : Request):Promise<any>=>{
    const id=req.query.id;

    const item=await ItemModel.findById(id);

    return item?.availability;

}


const disableItem= async(req:Request):Promise<any>=>{
    const id=req.params.id;

    const item=await ItemModel.findById(id);

    if(item){
        item.is_active=false;
        await item.save();
        return item;
    }
    else{
        return null;
    }
}

const enableItem= async(req:Request):Promise<any>=>{
    const id=req.params.id;

    const item=await ItemModel.findById(id);

    if(item){
        item.is_active=true;
        await item.save();
        return item;
    }
    else{
        return null;
    } 
}


import 'dotenv/config'
import mongoose from 'mongoose'

import { connectDB } from '../infrastructure/database/mongoose.connection'

import { CategoryModel } from '../modules/catalog/domain/category.entity'
import { ItemModel } from '../modules/catalog/domain/item.entity'
import { AddonModel } from '../modules/addons/domain/addon.entity'
import { AddonGroupModel } from '../modules/addons/domain/addon-group.entity'

const seed = async () => {
  await connectDB()

  console.log('🧹 Clearing old data...')
  await Promise.all([
    CategoryModel.deleteMany({}),
    ItemModel.deleteMany({}),
    AddonModel.deleteMany({}),
    AddonGroupModel.deleteMany({})
  ])

  console.log('🌱 Seeding category...')
  const category = await CategoryModel.create({
    name: 'Beverages',
    tax_applicable: true,
    tax_percentage: 5
  })

  console.log('🌱 Seeding item...')
  const item = await ItemModel.create({
    name: 'Coffee',
    parent_type: 'CATEGORY',
    parent_id: category._id,
    pricing: {
      type: 'STATIC',
      config: {
        price: 200
      }
    },
    is_active: true
  })

  console.log('🌱 Seeding addons...')
  const extraShot = await AddonModel.create({
    item_id: item._id,
    name: 'Extra Shot',
    price: 50
  })

  const oatMilk = await AddonModel.create({
    item_id: item._id,
    name: 'Oat Milk',
    price: 40
  })

  console.log('🌱 Seeding addon group...')
  await AddonGroupModel.create({
    item_id: item._id,
    name: 'Milk Options',
    required: false,
    min: 0,
    max: 1,
    addon_ids: [extraShot._id, oatMilk._id]
  })

  console.log('✅ Seed completed successfully')
  process.exit(0)
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})

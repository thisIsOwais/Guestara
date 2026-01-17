import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from '../infrastructure/database/mongoose.connection'

import { CategoryModel } from '../modules/catalog/domain/category.entity'
import { ItemModel } from '../modules/catalog/domain/item.entity'
import { AddonModel } from '../modules/addons/domain/addon.entity'
import { AddonGroupModel } from '../modules/addons/domain/addon-group.entity'

;import { SubcategoryModel } from '../modules/catalog/domain/subcategory.entity'
(async () => {
  try {
    await connectDB()

    await Promise.all([
      CategoryModel.deleteMany({}),
      ItemModel.deleteMany({}),
      AddonModel.deleteMany({}),
      AddonGroupModel.deleteMany({})
    ])

    const category = await CategoryModel.create({
      name: 'Beverage',
      tax_applicable: true,
      tax_percentage: 5
    })

    const subCategory= await SubcategoryModel.create({
      category_id: category._id, // Assuming you have a category_id field in your SubcategoryModel schem
      name: 'Hot Beverage',
      description: 'Hot Beverage',
      tax_applicable: true,
      tax_percentage: 5
    })

    const item = await ItemModel.create({
      name: 'Coffee',
      parent_type: 'SUBCATEGORY',
      parent_id: subCategory._id,
      pricing: {
        type: 'STATIC',
        config: { price: 200 }
      }
    })

    await AddonModel.insertMany([
      { item_id: item._id, name: 'Extra Shot', price: 50 },
      { item_id: item._id, name: 'Oat Milk', price: 40 }
    ])

    console.log('✅ Seed completed')
    mongoose.disconnect()
  } catch (err) {
    console.error(err)
  }
})()

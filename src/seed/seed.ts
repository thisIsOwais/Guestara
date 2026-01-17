// import 'dotenv/config'
// import mongoose from 'mongoose'
// import { connectDB } from '../infrastructure/database/mongoose.connection'

// import { CategoryModel } from '../modules/catalog/domain/category.entity'
// import { ItemModel } from '../modules/catalog/domain/item.entity'
// import { AddonModel } from '../modules/addons/domain/addon.entity'
// import { AddonGroupModel } from '../modules/addons/domain/addon-group.entity'

// ;import { SubcategoryModel } from '../modules/catalog/domain/subcategory.entity'
// (async () => {
//   try {
//     await connectDB()

//     await Promise.all([
//       CategoryModel.deleteMany({}),
//       ItemModel.deleteMany({}),
//       AddonModel.deleteMany({}),
//       AddonGroupModel.deleteMany({})
//     ])

//     const category = await CategoryModel.create({
//       name: 'Beverage',
//       tax_applicable: true,
//       tax_percentage: 5
//     })

//     const subCategory= await SubcategoryModel.create({
//       category_id: category._id, // Assuming you have a category_id field in your SubcategoryModel schem
//       name: 'Hot Beverage',
//       description: 'Hot Beverage',
//       tax_applicable: true,
//       tax_percentage: 5
//     })

//     const item = await ItemModel.create({
//       name: 'Coffee',
//       parent_type: 'SUBCATEGORY',
//       parent_id: subCategory._id,
//       pricing: {
//         type: 'STATIC',
//         config: { price: 200 }
//       }
//     })

//     await AddonModel.insertMany([
//       { item_id: item._id, name: 'Extra Shot', price: 50 },
//       { item_id: item._id, name: 'Oat Milk', price: 40 }
//     ])

//     console.log('✅ Seed completed')
//     mongoose.disconnect()
//   } catch (err) {
//     console.error(err)
//   }
// })()


import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from '../infrastructure/database/mongoose.connection'

import { CategoryModel } from '../modules/catalog/domain/category.entity' 
import { SubcategoryModel } from '../modules/catalog/domain/subcategory.entity' 
import { ItemModel } from '../modules/catalog/domain/item.entity'
import { AddonModel } from '../modules/addons/domain/addon.entity'
import { AddonGroupModel } from '../modules/addons/domain/addon-group.entity'




async function seed() {
  try {
    await connectDB();
    console.log('✅ Mongo connected')

    // 🔥 CLEAN DB
    await Promise.all([
      CategoryModel.deleteMany({}),
      SubcategoryModel.deleteMany({}),
      ItemModel.deleteMany({}),
      AddonModel.deleteMany({}),
      AddonGroupModel.deleteMany({})
    ])

    // ===============================
    // 🟦 CATEGORIES
    // ===============================
    const beverages = await CategoryModel.create({
      name: 'Beverages',
      tax_applicable: true,
      tax_percentage: 5
    })

    const breakfast = await CategoryModel.create({
      name: 'Breakfast',
      tax_applicable: true,
      tax_percentage: 5
    })

    const meetingRoom = await CategoryModel.create({
      name: 'Meeting Room',
      tax_applicable: true,
      tax_percentage: 18
    })

    // ===============================
    // 🟦 SUBCATEGORIES
    // ===============================
    const coffeeSub = await SubcategoryModel.create({
      category_id: beverages._id,
      name: 'Coffee'
    })

    const teaSub = await SubcategoryModel.create({
      category_id: beverages._id,
      name: 'Tea'
    })

    const breakfastComboSub = await SubcategoryModel.create({
      category_id: breakfast._id,
      name: 'Combos'
    })

    // ===============================
    // 🟦 ITEMS
    // ===============================

    // ☕ Cappuccino (static)
    const cappuccino = await ItemModel.create({
      parent_type: 'SUBCATEGORY',
      parent_id: coffeeSub._id,
      name: 'Cappuccino',
      pricing: {
        type: 'STATIC',
        config: {
          price: 200
        }
      },
      availability: {
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        slots: [{ start: '09:00', end: '18:00' }]
      }
    })

    // 🍳 Breakfast Combo (dynamic 9–11)
    const breakfastCombo = await ItemModel.create({
      parent_type: 'SUBCATEGORY',
      parent_id: breakfastComboSub._id,
      name: 'Veg Breakfast Combo',
      pricing: {
        type: 'DYNAMIC',
        config: {
          windows: [
            {
              start: '09:00',
              end: '11:00',
              price: 199
            }
          ]
        }
      },
      availability: {
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        slots: [{ start: '09:00', end: '11:00' }]
      }
    })

    // 🏢 Meeting Room (tiered pricing)
    const meetingRoomItem = await ItemModel.create({
      parent_type: 'CATEGORY',
      parent_id: meetingRoom._id,
      name: 'Conference Room',
      pricing: {
        type: 'TIERED',
        config: {
          tiers: [
            { upto: 1, price: 300 },
            { upto: 2, price: 500 },
            { upto: 4, price: 800 }
          ]
        }
      },
      availability: {
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        slots: [{ start: '10:00', end: '17:00' }]
      }
    })

    // ===============================
    // 🟦 ADDONS
    // ===============================
    const extraShot = await AddonModel.create({
      item_id: cappuccino._id,
      name: 'Extra Coffee Shot',
      price: 50
    })

    const oatMilk = await AddonModel.create({
      item_id: cappuccino._id,
      name: 'Oat Milk',
      price: 40
    })

    const teaAddon = await AddonModel.create({
      item_id: breakfastCombo._id,
      name: 'Tea',
      price: 0
    })

    const coffeeAddon = await AddonModel.create({
      item_id: breakfastCombo._id,
      name: 'Coffee',
      price: 20
    })

    // ===============================
    // 🟦 ADDON GROUPS
    // ===============================
    await AddonGroupModel.create({
      item_id: cappuccino._id,
      name: 'Extras',
      required: false,
      min: 0,
      max: 2,
      addon_ids: [extraShot._id, oatMilk._id]
    })

    await AddonGroupModel.create({
      item_id: breakfastCombo._id,
      name: 'Beverage Choice',
      required: true,
      min: 1,
      max: 1,
      addon_ids: [teaAddon._id, coffeeAddon._id]
    })

    console.log('🌱 SEEDING DONE SUCCESSFULLY')
    process.exit(0)
  } catch (err) {
    console.error('❌ SEED ERROR', err)
    process.exit(1)
  }
}

seed()

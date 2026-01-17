import { ItemPricingService } from './item-pricing.service'

export class OrderPricingService {
  static async getOrderPrice(items: any[]) {
    let subtotal = 0
    let tax = 0

    const pricedItems = []

    for (const entry of items) {
      const price = await ItemPricingService.getPrice({
        itemId: entry.item_id,
        quantity: entry.quantity,
        time: entry.time,
        addons: entry.addons
      })

      subtotal += price.base_price
      tax += price.tax_amount

      pricedItems.push({
        item_id: entry.item_id,
        quantity: entry.quantity,
        ...price
      })
    }

    return {
      items: pricedItems,
      summary: {
        subtotal,
        tax,
        grand_total: subtotal + tax
      }
    }
  }
}

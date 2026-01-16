import { PricingStrategy } from './pricing-strategy.interface'

export class DiscountedPricingStrategy implements PricingStrategy {
  validate(config: any): void {
    if (config.base_price < 0) {
      throw new Error('Base price must be >= 0')
    }

    if (!config.discount) {
      throw new Error('Discount config missing')
    }
  }

  calculate(config: any) {
    const { base_price, discount } = config

    let discountAmount = 0

    if (discount.type === 'FLAT') {
      discountAmount = discount.value
    } else if (discount.type === 'PERCENT') {
      discountAmount = (base_price * discount.value) / 100
    }

    const final = Math.max(base_price - discountAmount, 0)

    return {
      base_price: final,
      metadata: { discount_applied: discountAmount }
    }
  }
}

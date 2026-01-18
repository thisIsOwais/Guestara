import { PricingStrategy } from './pricing-strategy.interface'

export class TieredPricingStrategy implements PricingStrategy {
  validate(config: any): void {
    if (!Array.isArray(config.tiers) || config.tiers.length === 0) {
      throw new Error('Tiered pricing requires tiers')
    }

    const sorted = [...config.tiers].sort((a, b) => a.up_to - b.up_to)

    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].up_to <= sorted[i - 1].up_to) {
        throw new Error('Tier ranges overlap or are invalid')
      }
    }
  }
  
  calculate(config: any, context: { quantity: number }) {
    console.log(typeof context.quantity)
    const tier = config.tiers
      .sort((a: { upto: number }, b: { upto: number }) => a.upto - b.upto)
      .find((t: any) => context.quantity <= t.upto )
    
    
    if (!tier) {
      throw new Error('No applicable tier found')
    }

    return {
      base_price: tier.price,
      metadata: { applied_tier: tier }
    }
  }
}

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
    const tier = config.tiers
      .sort((a: { up_to: number }, b: { up_to: number }) => a.up_to - b.up_to)
      .find((t: any) => context.quantity <= t.up_to)

    if (!tier) {
      throw new Error('No applicable tier found')
    }

    return {
      base_price: tier.price,
      metadata: { applied_tier: tier }
    }
  }
}

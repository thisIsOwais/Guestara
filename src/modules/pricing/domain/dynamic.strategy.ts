import { PricingStrategy } from './pricing-strategy.interface'

export class DynamicPricingStrategy implements PricingStrategy {
  validate(config: any): void {
    if (!Array.isArray(config.windows)) {
      throw new Error('Dynamic pricing requires windows')
    }

    const sorted = [...config.windows].sort(
      (a, b) => a.start.localeCompare(b.start)
    )
    

    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].start < sorted[i - 1].end) {
        throw new Error('Overlapping pricing windows')
      }
    }
  }

  calculate(config: any, context: { time: string }) {
    const window = config.windows.find(
      (w: any) => context.time >= w.start && context.time < w.end
    )
    


    if (!window) {
      throw new Error('Item not available at this time')
    }

    return {
      base_price: window.price,
      metadata: { applied_window: window }
    }
  }
}

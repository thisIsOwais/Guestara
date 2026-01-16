import { PricingStrategy } from './pricing-strategy.interface'

export class ComplimentaryPricingStrategy implements PricingStrategy {
  validate(_: any): void {
    // No config allowed
  }

  calculate() {
    return {
      base_price: 0
    }
  }
}

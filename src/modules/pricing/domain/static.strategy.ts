import { PricingStrategy } from './pricing-strategy.interface'


export class StaticPricingStrategy implements PricingStrategy {
  validate(config: any): void {
    if (typeof config.price !== 'number' || config.price < 0) {
      throw new Error('Invalid static price')
    }
  }

  calculate(config: any) {
    return {
      base_price: config.price
    }
  }
}

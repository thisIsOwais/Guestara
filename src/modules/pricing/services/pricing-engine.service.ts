
  import { resolveTaxPercentage } from './tax-resolver.service'
  import { StaticPricingStrategy } from '../domain/static.strategy'
  import { TieredPricingStrategy } from '../domain/tiered.strategy'
  import { ComplimentaryPricingStrategy } from '../domain/complimentary.strategy'
  import { DiscountedPricingStrategy } from '../domain/discounted.strategy'
  import { DynamicPricingStrategy } from '../domain/dynamic.strategy'
//   TieredPricingStrategy
  export class PricingEngineService {
    private strategies: any
  
    constructor() {
      this.strategies = {
        STATIC: new StaticPricingStrategy(),
        TIERED: new TieredPricingStrategy(),
        COMPLIMENTARY: new ComplimentaryPricingStrategy(),
        DISCOUNTED: new DiscountedPricingStrategy(),
        DYNAMIC: new DynamicPricingStrategy()
      }
    }
  
    calculatePrice({
      item,
      subcategory,
      category,
      context
    }: any) {
      const strategy = this.strategies[item.pricing.type]
  
      if (!strategy) {
        throw new Error('Unsupported pricing type')
      }
  
      strategy.validate(item.pricing.config)
  
      const pricingResult = strategy.calculate(
        item.pricing.config,
        context
      )
  
      const taxPercent = resolveTaxPercentage(item, subcategory, category)
      const taxAmount = (pricingResult.base_price * taxPercent) / 100
  
      return {
        pricing_type: item.pricing.type,
        base_price: pricingResult.base_price,
        tax_percentage: taxPercent,
        tax_amount: taxAmount,
        final_price: pricingResult.base_price + taxAmount,
        metadata: pricingResult.metadata
      }
    }
  }
  
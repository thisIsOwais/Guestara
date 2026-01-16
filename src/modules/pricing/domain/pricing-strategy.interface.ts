export interface PricingResult {
    base_price: number
    metadata?: any
  }
  
  export interface PricingStrategy {
    validate(config: any): void
    calculate(config: any, context?: any): PricingResult
  }
  
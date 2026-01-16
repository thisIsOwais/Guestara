export enum PricingType {
    STATIC = 'STATIC',
    TIERED = 'TIERED',
    DYNAMIC = 'DYNAMIC'
  }
  
  export interface Tier {
    min: number
    max: number
    price: number
  }
  
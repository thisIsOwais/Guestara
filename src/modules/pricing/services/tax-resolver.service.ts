export const resolveTaxPercentage = (
    item: any,
    subcategory: any,
    category: any
  ): number => {
    if (item?.tax_applicable) return item.tax_percentage
    if (subcategory?.tax_applicable) return subcategory.tax_percentage
    if (category?.tax_applicable) return category.tax_percentage
    return 0
  }
  
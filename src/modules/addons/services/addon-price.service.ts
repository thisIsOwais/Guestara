import { AddonModel } from '../domain/addon.entity'

export class AddonPriceService {
  async calculate(addonIds: string[]) {
    const addons = await AddonModel.find({
      _id: { $in: addonIds },
      is_active: true
    })

    return addons.reduce((sum, a) => sum + a.price, 0)
  }
}

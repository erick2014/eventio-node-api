import {Shop} from '../models/shopModel.js'

class ShopController{

  getShops(){
    return  Shop.findAll({raw:true})
  }

  async newShop({name,address,telephone}){
    try {
      const shop = await Shop.create({
        name,
        address,
        telephone,
      })
      return shop
    } catch (error) {
      throw error
    }
  }

}

export default ShopController
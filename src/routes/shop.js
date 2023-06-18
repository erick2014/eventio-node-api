import { Router } from "express";
import ShopController from '../controllers/shopController.js'

const router = Router()
const shopController = new ShopController()

router.get('/', async(_,res,next)=>{
  try {
    const response = await shopController.getShops()
    res.json(response)
  } catch (error) {
    next(error)
  }
})

router.post('/',async(req,res,next)=>{
  try {
    const body = req.body
    const response = await shopController.newShop(body)
    res.json(response)
  } catch (error) {
    next(error)
  }
})

export default router
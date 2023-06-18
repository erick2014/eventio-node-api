import {Router} from 'express'
import shopRoutes from './shop.js'

const mainRouter = Router()

mainRouter.use('/shop',shopRoutes)

export default mainRouter
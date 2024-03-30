import {Router} from 'express';
const router = Router();

import userRouter from './user-route'
import roleRouter from './role-route'
import productRouter from './product-route'
import specificationRouter from './specification-route'
import categoryRouter from './category-route'
import imageRouter from './image-route'
import documentRouter from './document-route'
import valueRouter from './value-route'
import typeRouter from './type-route'
import orderRouter from './order-route'
import statusRouter from './status-route'
import levelRouter from './level-route'
import cartRouter from './cart-route'
import likeRouter from './like-route'

router.use('/users', userRouter)
router.use('/roles', roleRouter)
router.use('/products', productRouter)
router.use('/specifications', specificationRouter)
router.use('/categories', categoryRouter)
router.use('/images', imageRouter)
router.use('/documents', documentRouter)
router.use('/values', valueRouter)
router.use('/types', typeRouter)
router.use('/orders', orderRouter)
router.use('/statuses', statusRouter)
router.use('/levels', levelRouter)
router.use('/carts', cartRouter)
router.use('/likes', likeRouter)

export default router

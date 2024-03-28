const Router = require('express');
const router = new Router();

const userRouter = require('./user-route')
const roleRouter = require('./role-route')
const productRouter = require('./product-route')
const specificationRouter = require('./specification-route')
const categoryRouter = require('./category-route')
const imageRouter = require('./image-route')
const documentRouter = require('./document-route')
const valueRouter = require('./value-route')
const typeRouter = require('./type-route')
const orderRouter = require('./order-route')
const statusRouter = require('./status-route')
const levelRouter = require('./level-route')
const cartRouter = require('./cart-route')
const likeRouter = require('./like-route')

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

module.exports = router
export {}

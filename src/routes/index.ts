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

router.use('/users', userRouter)
router.use('/roles', roleRouter)
router.use('/products', productRouter)
router.use('/specifications', specificationRouter)
router.use('/categories', categoryRouter)
router.use('/images', imageRouter)
router.use('/documents', documentRouter)
router.use('/values', valueRouter)

module.exports = router
export {}
const Router = require('express');
const router = new Router();

const userRouter = require('./user-route')
const roleRouter = require('./role-route')

router.use('/user', userRouter)
router.use('/role', roleRouter)

module.exports = router
export {}
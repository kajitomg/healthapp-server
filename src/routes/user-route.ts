const {userController} = require('../controllers/user-controller');
const Router = require('express');
const router = new Router();
const authMiddleWare = require('../middlewares/auth-middleware')
const accessMiddleWare = require('../middlewares/access-middleware')

router.post('/registartion', userController.registration)
router.post('/create', userController.create)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.get('/users', authMiddleWare, userController.getUsers)


module.exports = router
export {}
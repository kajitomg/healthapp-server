import {cartController} from "../controllers/cart-controller";

const accessMiddleWare = require('../middlewares/access-middleware')
const checkReferer = require('../middlewares/check-referer-middleware')
const authMiddleWare = require('../middlewares/auth-middleware')
const Router = require('express');
const router = new Router();

router.get('/:id', cartController.get) // Получить корзину

router.patch('/products/add/:id', cartController.addProducts) // Добавить продукты в корзину
router.patch('/products/delete/:id', cartController.deleteProducts) // Удалить продукты из корзины
router.patch('/products/increment/:id', cartController.incrementProduct) // Инкрементировать продукты в корзине
router.patch('/products/decrement/:id', cartController.decrementProduct) // Декрементировать продукты в корзине

module.exports = router
export {}
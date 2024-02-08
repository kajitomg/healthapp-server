import {IRouter} from "express";
import {orderController} from "../controllers/order-controller";

const accessMiddleWare = require('../middlewares/access-middleware')
const authMiddleWare = require('../middlewares/auth-middleware')
const Router = require('express');
const router: IRouter = new Router();

router.post('', accessMiddleWare(200), orderController.create) // Создание заказа
router.get('', accessMiddleWare(200), orderController.gets) // Получение заказов
router.put('', accessMiddleWare(200), orderController.update) // Изменение заказа
router.delete('', accessMiddleWare(200), orderController.destroy) // Удаление заказа

module.exports = router
export {}
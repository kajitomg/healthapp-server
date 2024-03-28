import {IRouter} from "express";
import {orderController} from "../controllers/order-controller";

const accessMiddleWare = require('../middlewares/access-middleware')
const authMiddleWare = require('../middlewares/auth-middleware')
const Router = require('express');
const router: IRouter = new Router();

router.post('', authMiddleWare, orderController.create) // Создание заказа
router.get('', authMiddleWare, orderController.gets) // Получение заказов
router.put('/:id', authMiddleWare, orderController.update) // Изменение заказа
router.delete('/:id', authMiddleWare, orderController.destroy) // Удаление заказа

module.exports = router
export {}
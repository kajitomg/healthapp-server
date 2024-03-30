import {orderController} from "../controllers/order-controller";
import {Router} from 'express';
import authMiddleWare from '../middlewares/auth-middleware'
import accessMiddleWare from '../middlewares/access-middleware'
const router = Router();

router.post('', authMiddleWare, orderController.create) // Создание заказа
router.get('', authMiddleWare, orderController.gets) // Получение заказов
router.put('/:id', authMiddleWare, orderController.update) // Изменение заказа
router.delete('/:id', authMiddleWare, orderController.destroy) // Удаление заказа


export default router
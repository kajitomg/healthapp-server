import {cartController} from "../controllers/cart-controller";
import {Router} from 'express';
import authMiddleWare from '../middlewares/auth-middleware'
import accessMiddleWare from '../middlewares/access-middleware'
const router = Router();

router.get('/:id', cartController.get) // Получить корзину

router.patch('/products/add/:id', cartController.addProducts) // Добавить продукты в корзину
router.patch('/products/delete/:id', cartController.deleteProducts) // Удалить продукты из корзины
router.patch('/products/increment/:id', cartController.incrementProduct) // Инкрементировать продукты в корзине
router.patch('/products/decrement/:id', cartController.decrementProduct) // Декрементировать продукты в корзине


export default router
import {likeController} from "../controllers/like-controller";
import {Router} from 'express';
import authMiddleWare from '../middlewares/auth-middleware'
import accessMiddleWare from '../middlewares/access-middleware'
const router = Router();

router.get('/:id', likeController.get) // Получить понравившееся

router.patch('/products/add/:id', likeController.addProducts) // Добавить продукты в понравившееся
router.patch('/products/delete/:id', likeController.deleteProducts) // Удалить продукты из понравившегося


export default router
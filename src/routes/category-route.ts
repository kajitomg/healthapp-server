import {categoryController} from "../controllers/category-controller";
import {Router} from 'express';
import authMiddleWare from '../middlewares/auth-middleware'
import accessMiddleWare from '../middlewares/access-middleware'
const router = Router();

router.post('', accessMiddleWare(200), categoryController.create) // Создание категории
router.get('', categoryController.gets) // Получение категорий
router.put('', accessMiddleWare(200), categoryController.update) // Обновление категории
router.delete('', accessMiddleWare(200), categoryController.destroy) // Удаление категории *

router.get('/:id', categoryController.get) // Создание категории

router.post('/children', accessMiddleWare(200), categoryController.addChildren) // Добавление категории



export default router
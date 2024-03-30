import {levelController} from "../controllers/level-controller";
import {Router} from 'express';
import authMiddleWare from '../middlewares/auth-middleware'
import accessMiddleWare from '../middlewares/access-middleware'
const router = Router();

router.post('', accessMiddleWare(200), levelController.create) // Создание уровня
router.get('', accessMiddleWare(200), levelController.gets) // Получение уровней
router.put('', accessMiddleWare(200), levelController.update) // Обновление уровня
router.delete('', accessMiddleWare(200), levelController.destroy) // Удаление уровня


export default router
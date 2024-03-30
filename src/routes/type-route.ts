import {typeController} from "../controllers/type-controller";
import {Router} from 'express';
import authMiddleWare from '../middlewares/auth-middleware'
import accessMiddleWare from '../middlewares/access-middleware'
const router = Router();

router.post('', accessMiddleWare(200), typeController.create) // Создание значения
router.get('', typeController.gets) // Получение значений
router.put('', accessMiddleWare(200), typeController.update) // Изменение значения
router.delete('', accessMiddleWare(200), typeController.destroy) // Удаление значения


export default router
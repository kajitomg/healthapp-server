import {valueController} from "../controllers/value-controller";
import {Router} from 'express';
import authMiddleWare from '../middlewares/auth-middleware'
import accessMiddleWare from '../middlewares/access-middleware'
const router = Router();

router.post('/', accessMiddleWare(200), valueController.create) // Создание значения
router.get('/', accessMiddleWare(200), valueController.gets) // Получение значений
router.put('', accessMiddleWare(200), valueController.update) // Изменение значения
router.delete('', accessMiddleWare(200), valueController.destroy) // Удаление значения


export default router
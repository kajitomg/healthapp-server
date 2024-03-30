import {statusController} from "../controllers/status-controller";
import {Router} from 'express';
import authMiddleWare from '../middlewares/auth-middleware'
import accessMiddleWare from '../middlewares/access-middleware'
const router = Router();

router.post('', accessMiddleWare(200), statusController.create) // Создание статуса
router.get('', accessMiddleWare(200), statusController.gets) // Получение статусов
router.put('', accessMiddleWare(200), statusController.update) // Изменение статуса
router.delete('', accessMiddleWare(200), statusController.destroy) // Удаление статуса


export default router
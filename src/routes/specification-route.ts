import {specificationController} from "../controllers/specification-controller";
import {Router} from 'express';
import authMiddleWare from '../middlewares/auth-middleware'
import accessMiddleWare from '../middlewares/access-middleware'
const router = Router();

router.post('', accessMiddleWare(200), specificationController.create) // Создание характеристики
router.get('', authMiddleWare, specificationController.gets) // Получение характеристик
router.put('', accessMiddleWare(200), specificationController.update) // Изменение характеристики
router.delete('', accessMiddleWare(200), specificationController.destroy) // Удаление характеристики

router.put('/value', accessMiddleWare(200), specificationController.addValue) // Добавление значения характеристики
router.delete('/value', accessMiddleWare(200), specificationController.destroyValue) // Удаление значения характеристики



export default router
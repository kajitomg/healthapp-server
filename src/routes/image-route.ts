import {FileloadService} from "../services/fileloader";
import {imageController} from "../controllers/image-controller";
import {Router} from 'express';
import authMiddleWare from '../middlewares/auth-middleware'
import accessMiddleWare from '../middlewares/access-middleware'
const router = Router();

router.post('', accessMiddleWare(200), FileloadService.upload('images').single('image'), imageController.create) // Создание изображения
router.get('', accessMiddleWare(200), imageController.get) // Получение изображений
router.put('', accessMiddleWare(200), imageController.update) // Обновление изображения
router.delete('', accessMiddleWare(200), imageController.destroy) // Удаление изображения


export default router
import {FileloadService} from "../services/fileloader";
import {documentController} from "../controllers/document-controller";
import {Router} from 'express';
import authMiddleWare from '../middlewares/auth-middleware'
import accessMiddleWare from '../middlewares/access-middleware'
const router = Router();

router.post('', accessMiddleWare(200), FileloadService.upload('documents').single('document'), documentController.create) // Создание документа
router.get('', accessMiddleWare(200), documentController.get) // Получение документов
router.put('', accessMiddleWare(200), documentController.update) // Обновление документа
router.delete('', accessMiddleWare(200), documentController.destroy) // Удаление документа


export default router
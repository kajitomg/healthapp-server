
import {Router} from 'express';
import authMiddleWare from '../middlewares/auth-middleware'
import accessMiddleWare from '../middlewares/access-middleware'
const router = Router();

router.get('', accessMiddleWare(200), ) // Получить примеры //Query: ids:string[]
router.get('/:id', accessMiddleWare(200), ) // Получить пример

router.post('', accessMiddleWare(200), ) // Создать пример //UPD bulkCreate

router.put('/:id', accessMiddleWare(200), ) // Обновить пример
router.patch('/:id', accessMiddleWare(200), ) // Обновить часть примера

router.delete('/:id', accessMiddleWare(200), ) // Удалить пример
router.delete('', accessMiddleWare(200), ) // Удалить примеры //Query: ids:string[] //UPD bulkDelete


export default router
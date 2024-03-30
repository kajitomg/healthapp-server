const {roleController} = require('../controllers/role-controller');
import {Router} from 'express';
import authMiddleWare from '../middlewares/auth-middleware'
import accessMiddleWare from '../middlewares/access-middleware'
const router = Router();

router.post('', roleController.create) // Создание роли
router.get('', authMiddleWare, roleController.roles) // Получение всех ролей


export default router
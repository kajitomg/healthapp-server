import {userController} from '../controllers/user-controller';
import {Router} from 'express';
import authMiddleWare from '../middlewares/auth-middleware'
import accessMiddleWare from '../middlewares/access-middleware'
const router = Router();

router.post('', userController.create) // Создание аккаунта
router.get('', userController.gets) // Получение аккаунтов
router.put('/:id', authMiddleWare, userController.update) // Обновление данных аккаунта
router.put('/email/:id', authMiddleWare, userController.updateEmail) // Обновление почты аккаунта
router.put('/password/:id', authMiddleWare, userController.updatePassword) // Обновление пароля аккаунта
router.delete('', accessMiddleWare(200), userController.destroy) // Удаление аккаунта

router.post('/signup', userController.registration) // Регистрация аккаунта
router.post('/signin', userController.login) // Авторизация аккаунта
router.post('/signout', userController.logout) // Выход из аккаунта

router.post('/admin/signin', userController.adminLogin) // Авторизация аккаунта на админ. сервисах

router.get('/refresh', userController.refresh) // обновление токена доступа аккаунта
router.get('/activate/:link', userController.activate) // Активация аккаунта


export default router
const {userController} = require('../controllers/user-controller');
const Router = require('express');
const router = new Router();
const authMiddleWare = require('../middlewares/auth-middleware')
const accessMiddleWare = require('../middlewares/access-middleware')

router.post('', accessMiddleWare(100), userController.create) // Создание аккаунта
router.get('', authMiddleWare, userController.gets) // Получение аккаунтов
router.put('', accessMiddleWare(200), userController.update) // Обновление данных аккаунта
router.delete('', accessMiddleWare(200), userController.destroy) // Удаление аккаунта

router.post('/signup', accessMiddleWare(300), userController.registration) // Регистрация аккаунта
router.post('/signin', userController.login) // Авторизация аккаунта
router.post('/signout', userController.logout) // Выход из аккаунта

router.post('/admin/signin', userController.adminLogin) // Авторизация аккаунта на админ. сервисах

router.get('/refresh', userController.refresh) // обновление токена доступа аккаунта
router.get('/activate/:link', userController.activate) // Активация аккаунта


module.exports = router
export {}
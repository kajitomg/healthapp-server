const {roleController} = require('../controllers/role-controller');
const accessMiddleWare = require('../middlewares/access-middleware')
const authMiddleWare = require('../middlewares/auth-middleware')
const Router = require('express');
const router = new Router();

router.post('', roleController.create) // Создание роли
router.get('', authMiddleWare, roleController.roles) // Получение всех ролей


module.exports = router
export {}
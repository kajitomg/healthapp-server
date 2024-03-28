import {levelController} from "../controllers/level-controller";

const accessMiddleWare = require('../middlewares/access-middleware')
const checkReferer = require('../middlewares/check-referer-middleware')
const authMiddleWare = require('../middlewares/auth-middleware')
const Router = require('express');
const router = new Router();

router.post('', accessMiddleWare(200), levelController.create) // Создание уровня
router.get('', accessMiddleWare(200), levelController.gets) // Получение уровней
router.put('', accessMiddleWare(200), levelController.update) // Обновление уровня
router.delete('', accessMiddleWare(200), levelController.destroy) // Удаление уровня

module.exports = router
export {}
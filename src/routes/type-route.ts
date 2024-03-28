import {typeController} from "../controllers/type-controller";

const accessMiddleWare = require('../middlewares/access-middleware')
const checkReferer = require('../middlewares/check-referer-middleware')
const authMiddleWare = require('../middlewares/auth-middleware')
const Router = require('express');
const router = new Router();

router.post('', accessMiddleWare(200), typeController.create) // Создание значения
router.get('', typeController.gets) // Получение значений
router.put('', accessMiddleWare(200), typeController.update) // Изменение значения
router.delete('', accessMiddleWare(200), typeController.destroy) // Удаление значения

module.exports = router
export {}
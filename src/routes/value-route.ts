import {valueController} from "../controllers/value-controller";

const accessMiddleWare = require('../middlewares/access-middleware')
const checkReferer = require('../middlewares/check-referer-middleware')
const authMiddleWare = require('../middlewares/auth-middleware')
const Router = require('express');
const router = new Router();

router.post('/', accessMiddleWare(200), valueController.create) // Создание значения
router.get('/', accessMiddleWare(200), valueController.get) // Получение значения

module.exports = router
export {}
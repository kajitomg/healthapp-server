import {IRouter} from "express";
import {statusController} from "../controllers/status-controller";

const accessMiddleWare = require('../middlewares/access-middleware')
const authMiddleWare = require('../middlewares/auth-middleware')
const Router = require('express');
const router: IRouter = new Router();

router.post('', accessMiddleWare(200), statusController.create) // Создание статуса
router.get('', accessMiddleWare(200), statusController.gets) // Получение статусов
router.put('', accessMiddleWare(200), statusController.update) // Изменение статуса
router.delete('', accessMiddleWare(200), statusController.destroy) // Удаление статуса

module.exports = router
export {}
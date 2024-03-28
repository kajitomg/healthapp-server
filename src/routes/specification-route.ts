import {specificationController} from "../controllers/specification-controller";
import {IRouter} from "express";

const accessMiddleWare = require('../middlewares/access-middleware')
const authMiddleWare = require('../middlewares/auth-middleware')
const Router = require('express');
const router: IRouter = new Router();

router.post('', accessMiddleWare(200), specificationController.create) // Создание характеристики
router.get('', authMiddleWare, specificationController.gets) // Получение характеристик
router.put('', accessMiddleWare(200), specificationController.update) // Изменение характеристики
router.delete('', accessMiddleWare(200), specificationController.destroy) // Удаление характеристики

router.put('/value', accessMiddleWare(200), specificationController.addValue) // Добавление значения характеристики
router.delete('/value', accessMiddleWare(200), specificationController.destroyValue) // Удаление значения характеристики


module.exports = router
export {}
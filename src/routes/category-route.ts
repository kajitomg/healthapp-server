import {categoryController} from "../controllers/category-controller";

const accessMiddleWare = require('../middlewares/access-middleware')
const authMiddleWare = require('../middlewares/auth-middleware')
const Router = require('express');
const router = new Router();

router.post('', accessMiddleWare(200), categoryController.create) // Создание категории
router.get('', accessMiddleWare(200), categoryController.gets) // Получение категорий
router.put('', accessMiddleWare(200), categoryController.update) // Обновление категории
router.delete('', accessMiddleWare(200), categoryController.destroy) // Удаление категории *


module.exports = router
export {}
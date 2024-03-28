import {categoryController} from "../controllers/category-controller";

const accessMiddleWare = require('../middlewares/access-middleware')
const authMiddleWare = require('../middlewares/auth-middleware')
const Router = require('express');
const router = new Router();

router.post('', accessMiddleWare(200), categoryController.create) // Создание категории
router.get('', categoryController.gets) // Получение категорий
router.put('', accessMiddleWare(200), categoryController.update) // Обновление категории
router.delete('', accessMiddleWare(200), categoryController.destroy) // Удаление категории *

router.get('/:id', categoryController.get) // Создание категории

router.post('/children', accessMiddleWare(200), categoryController.addChildren) // Добавление категории


module.exports = router
export {}
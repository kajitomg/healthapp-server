import {likeController} from "../controllers/like-controller";

const accessMiddleWare = require('../middlewares/access-middleware')
const checkReferer = require('../middlewares/check-referer-middleware')
const authMiddleWare = require('../middlewares/auth-middleware')
const Router = require('express');
const router = new Router();

router.get('/:id', likeController.get) // Получить понравившееся

router.patch('/products/add/:id', likeController.addProducts) // Добавить продукты в понравившееся
router.patch('/products/delete/:id', likeController.deleteProducts) // Удалить продукты из понравившегося

module.exports = router
export {}
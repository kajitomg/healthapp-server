import {FileloadService} from "../services/fileloader";
import {imageController} from "../controllers/image-controller";

const accessMiddleWare = require('../middlewares/access-middleware')
const checkReferer = require('../middlewares/check-referer-middleware')
const authMiddleWare = require('../middlewares/auth-middleware')
const Router = require('express');
const router = new Router();

router.post('/', accessMiddleWare(200), FileloadService.upload('images').single('image'), imageController.create) // Создание изображения
router.get('/', accessMiddleWare(200), imageController.get) // Получение изображений

module.exports = router
export {}
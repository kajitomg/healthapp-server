import {FileloadService} from "../services/fileloader";
import {documentController} from "../controllers/document-controller";

const accessMiddleWare = require('../middlewares/access-middleware')
const checkReferer = require('../middlewares/check-referer-middleware')
const authMiddleWare = require('../middlewares/auth-middleware')
const Router = require('express');
const router = new Router();

router.post('/', accessMiddleWare(200), FileloadService.upload('documents').single('document'), documentController.create) // Создание документа
router.get('/', accessMiddleWare(200), documentController.get) // Получение документов

module.exports = router
export {}
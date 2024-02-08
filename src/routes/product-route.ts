const {productController} = require('../controllers/product-controller');
const accessMiddleWare = require('../middlewares/access-middleware')
const checkReferer = require('../middlewares/check-referer-middleware')
const authMiddleWare = require('../middlewares/auth-middleware')
const Router = require('express');
const router = new Router();

router.post('', accessMiddleWare(200), productController.create) // Создание продукта
router.get('', productController.gets) // Получение продуктов
router.get('/:id', accessMiddleWare(200), productController.get) // Получение продукта по id
router.put('', accessMiddleWare(200), productController.update) // Обновление продукта
router.delete('', accessMiddleWare(200), productController.destroy) // Удаление продукта

router.post('/image', accessMiddleWare(200), productController.addImage) // Добавление изображения
router.get('/images', accessMiddleWare(200), productController.images) // Получение изображений
router.delete('/image', accessMiddleWare(200), productController.destroyImage) // Удаление изображения

router.post('/document', accessMiddleWare(200), productController.addDocument) // Добавление документа
router.get('/documents', accessMiddleWare(200), productController.documents) // Получение документов
router.delete('/document', accessMiddleWare(200), productController.destroyDocument) // Удаление документа

router.post('/category', accessMiddleWare(200), productController.addCategory) // Добавление категории
router.get('/categories', accessMiddleWare(200), productController.categories) // Получение категории
router.delete('/category', accessMiddleWare(200), productController.destroyCategory) // Удаление категории

router.post('/specification', accessMiddleWare(200), productController.addSpecification) // Добавление характеристики
router.get('/specifications', accessMiddleWare(200), productController.specifications) // Получение характеристики
router.delete('/specification', accessMiddleWare(200), productController.destroySpecification) // Удаление характеристики

module.exports = router
export {}
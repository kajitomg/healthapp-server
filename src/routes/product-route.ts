const {productController} = require('../controllers/product-controller');
import {Router} from 'express';
import authMiddleWare from '../middlewares/auth-middleware'
import accessMiddleWare from '../middlewares/access-middleware'
const router = Router();

router.post('', accessMiddleWare(200), productController.create) // Создание продукта
router.get('', productController.gets) // Получение продуктов
router.get('/price/range', productController.priceRange) // Получение диапазона цен
router.get('/:id', productController.get) // Получение продукта по id
router.put('', accessMiddleWare(200), productController.update) // Обновление продукта
router.delete('', accessMiddleWare(200), productController.destroy) // Удаление продукта

router.post('/image', accessMiddleWare(200), productController.addImage) // Добавление изображения
router.get('/images', productController.images) // Получение изображений
router.delete('/image', accessMiddleWare(200), productController.destroyImage) // Удаление изображения

router.post('/document', accessMiddleWare(200), productController.addDocument) // Добавление документа
router.get('/documents', productController.documents) // Получение документов
router.delete('/document', accessMiddleWare(200), productController.destroyDocument) // Удаление документа

router.post('/category', accessMiddleWare(200), productController.addCategory) // Добавление категории
router.get('/categories', productController.categories) // Получение категории
router.delete('/category', accessMiddleWare(200), productController.destroyCategory) // Удаление категории

router.post('/specification', accessMiddleWare(200), productController.addSpecification) // Добавление характеристики
router.get('/specifications', productController.specifications) // Получение характеристики
router.delete('/specification', accessMiddleWare(200), productController.destroySpecification) // Удаление характеристики


export default router
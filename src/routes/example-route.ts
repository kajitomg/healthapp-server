

const accessMiddleWare = require('../middlewares/access-middleware')
const checkReferer = require('../middlewares/check-referer-middleware')
const authMiddleWare = require('../middlewares/auth-middleware')
const Router = require('express');
const router = new Router();

router.get('', accessMiddleWare(200), ) // Получить примеры //Query: ids:string[]
router.get('/:id', accessMiddleWare(200), ) // Получить пример

router.post('', accessMiddleWare(200), ) // Создать пример //UPD bulkCreate

router.put('/:id', accessMiddleWare(200), ) // Обновить пример
router.patch('/:id', accessMiddleWare(200), ) // Обновить часть примера

router.delete('/:id', accessMiddleWare(200), ) // Удалить пример
router.delete('', accessMiddleWare(200), ) // Удалить примеры //Query: ids:string[] //UPD bulkDelete

module.exports = router
export {}
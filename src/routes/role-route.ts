const {roleController} = require('../controllers/role-controller');
const Router = require('express');
const router = new Router();

router.get('/create', roleController.create)


module.exports = router
export {}
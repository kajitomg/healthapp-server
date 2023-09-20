const { roleController } = require('../controllers/role-controller');
const Router = require('express');
const router = new Router();

router.post('/create', roleController.create)
router.get('/roles', roleController.roles)


module.exports = router
export { }
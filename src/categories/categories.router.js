const Router = require('koa-joi-router');

const { controllers } = require('./categories.controller');
const categoriesValidator = require('./categories.validator');

const router = new Router();

router.get('/:categoryId', controllers.getCategory);
router.get('/', controllers.getCategoriesList);
router.post('/', categoriesValidator.createCategory, controllers.createCategory);
router.delete('/', controllers.deleteCategory);

module.exports = router;

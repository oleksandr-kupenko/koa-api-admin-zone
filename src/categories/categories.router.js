const Router = require('koa-router');

const { controllers } = require('./categories.controller');

const router = new Router();

router.get('categories/:categoryId', controllers.getCategory);
router.get('categories', controllers.getCategoriesList);
router.post('categories', controllers.createCategory);
router.post('users-from-category/id', controllers.getUsersFromCategoryById);
router.post('users-from-category/name', controllers.getUsersFromCategoryByName);
router.delete('categories', controllers.deleteCategory);

module.exports = {
  router,
};

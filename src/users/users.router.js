const Router = require('koa-joi-router');
const passport = require('koa-passport');

const { UsersController } = require('./users.controller');
const UsersValidator = require('./users.validator');

const router = new Router();

router.get('/:userId', UsersController.getUser);
router.get('/', UsersController.getUsersList);
router.post('/sign-up', UsersValidator.signUp, UsersController.createUser);
router.delete('/', UsersController.deleteUser);
router.post('/sign-in', UsersValidator.signIn, UsersController.signIn);
router.get('/profile', passport.authenticate('jwt', { session: false }), UsersController.profile);
router.get('/refresh/token', UsersController.refreshToken);
router.post('/category-id', UsersValidator.getUsersFromCategoryById, UsersController.getUsersFromCategoryById);
router.post('/category-name', UsersValidator.getUsersFromCategoryByName, UsersController.getUsersFromCategoryByName);
router.put('/photo', passport.authenticate('jwt', { session: false }), UsersController.updatePhoto);

module.exports = router;

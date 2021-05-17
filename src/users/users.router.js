const Router = require('koa-joi-router');
const passport = require('koa-passport');

const { UsersController } = require('./users.controller');
const UsersValidator = require('./users.validator');

const router = new Router();

router.get('/email', UsersValidator.email, UsersController.getUserByEmail);
router.put('/photo', passport.authenticate('jwt', { session: false }), UsersController.updatePhoto);
router.get('/', UsersController.getUsersList);
router.get('/count', UsersController.getCountUsers);
router.get('/profile', passport.authenticate('jwt', { session: false }), UsersController.getProfile);
router.put('/profile', passport.authenticate('jwt', { session: false }), UsersController.updateProfile);
router.put('/rating', passport.authenticate('jwt', { session: false }), UsersController.updateRating);
router.put('/status', passport.authenticate('jwt', { session: false }), UsersController.updateStatusAdmin);
router.put('/pass-reset', UsersController.resetPassword);

router.post('/sign-up', UsersValidator.signUp, UsersController.createUser);
router.delete('/', UsersController.deleteUser);
router.post('/sign-in', UsersValidator.signIn, UsersController.signIn);

router.get('/refresh/token', UsersController.refreshToken);
router.get('/category-id/:catId', UsersValidator.getUsersFromCategoryById, UsersController.getUsersFromCategoryById);
router.get(
  '/category-name/:catName',
  UsersValidator.getUsersFromCategoryByName,
  UsersController.getUsersFromCategoryByName
);

router.get('/:userId', UsersController.getUser);

module.exports = router;

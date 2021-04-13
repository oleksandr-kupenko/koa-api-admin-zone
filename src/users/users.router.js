const Router = require('koa-router');
const passport = require('koa-passport');

const { controllers } = require('./users.controller');

const router = new Router();

router.get('users/:userId', controllers.getUser);
router.get('users', controllers.getUsersList);
router.post('users', controllers.createUser);
router.delete('users', controllers.deleteUser);
router.post('sign-in', controllers.signIn);
router.get('profile', passport.authenticate('jwt', { session: false }), controllers.profile);
router.get('refresh/token', controllers.refreshToken);

module.exports = {
  router,
};

const Router = require('koa-router');
const controllers = require('./users.controller');
const router = new Router();
const passport = require('koa-passport');

router.get('users/:userId', controllers.conrollersList.getUser);
router.get('users', controllers.conrollersList.usersList);
router.post('user', controllers.conrollersList.createUser);
router.delete('users', controllers.conrollersList.deleteUser);
router.post('sign-in', controllers.conrollersList.signIn);
router.get('profile', passport.authenticate('jwt', { session: false }), controllers.conrollersList.profile);
router.get('refresh/token', controllers.conrollersList.refreshToken);

module.exports = {
  router,
};

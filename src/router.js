const Router = require('koa-router');
const fg = require('fast-glob');
const controllers = require('./controller');

const router = new Router();
// let PAGES = fg.sync(['src/templates/**/**.html'], { dot: true });

// PAGES.map((page) => {
//   page = page.split('/').slice(-1)[0].replace('.html', '');
//   router.get(`${page}.html`, controllers.conrollerCreator(`${page}.html`));
// });

// router.get('/', controllers.conrollerCreator('index'));

router.get('/', controllers.conrollerCreator.index);
router.get('sign-1', controllers.conrollerCreator.sign1);
router.get('sign-2', controllers.conrollerCreator.sign2);
router.get('sign-3', controllers.conrollerCreator.sign3);
router.get('sign-4', controllers.conrollerCreator.sign4);
router.get('sign-up-1', controllers.conrollerCreator.signUp1);
router.get('sign-up-2', controllers.conrollerCreator.signUp2);
router.get('sign-up-3', controllers.conrollerCreator.signUp3);
router.get('sign-up-4', controllers.conrollerCreator.signUp4);
router.get('sign-up-5', controllers.conrollerCreator.signUp5);
router.get('sign-up-6', controllers.conrollerCreator.signUp6);
router.get('profile-1', controllers.conrollerCreator.profile1);
router.get('profile-2', controllers.conrollerCreator.profile2);
router.get('search-1', controllers.conrollerCreator.search1);
router.get('search-2', controllers.conrollerCreator.search2);
router.get('admin', controllers.conrollerCreator.admin);

router.get('profile-1/:userId', controllers.conrollerCreator.profile1);
router.get('create-form', controllers.createUserForm);
router.post('create-user', controllers.createUser);
router.delete('delete-user', controllers.deleteUser);

module.exports = {
  router,
};

const Router = require('koa-router');
const fg = require('fast-glob');
const router = new Router();
const controllers = require('./controller');

let PAGES = fg.sync(['src/templates/**/**.html'], { dot: true });

PAGES.map((page) => {
  page = page.split('/').slice(-1)[0].replace('.html', '');
  router.get(`${page}.html`, controllers.conrollerCreator(`${page}.html`));
});

router.get('/', controllers.conrollerCreator('index'));

module.exports = {
  router,
};

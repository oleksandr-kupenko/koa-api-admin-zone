const Koa = require('koa');
const path = require('path');
const Router = require('koa-router');
const homeRouter = require('./router');
const views = require('koa-views');
const serve = require('koa-static');
const nunjucks = require('nunjucks');

const app = new Koa();

const nunjucksEnvironment = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(path.join(__dirname, './templates'))
);

const router = new Router();

const port = process.env.PORT || 3000;

const render = views(path.join(__dirname, './templates'), {
  extension: 'html',
  options: {
    nunjucksEnv: nunjucksEnvironment,
  },
  map: {
    html: 'nunjucks',
  },
});

app.use(render);
app.use(serve(path.join(__dirname, '/public')));

router.use('/', homeRouter.router.routes());

app.use(router.routes());

app.listen(port, () => {
  console.log(`I was born :-) ${port}`);
});

const Koa = require('koa');
const path = require('path');
const Router = require('koa-router');
const views = require('koa-views');
const serve = require('koa-static');
const nunjucks = require('nunjucks');
const bodyParser = require('koa-bodyparser');
const Redis = require('ioredis');
const globalRouter = require('./router');
const dotenv = require('dotenv');
dotenv.config();

const app = new Koa();

const redis = new Redis(process.env.REDISS_PASS);

app.context.redis = redis;

app.use(bodyParser());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.isJoi) {
      ctx.throw(400, err.details[0].message);
    }
    if (err.code == 23505) {
      ctx.throw(200, err.code);
    }
    console.log(err);
    ctx.throw(400, err);
  }
});

const nunjucksEnvironment = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(path.join(__dirname, './templates'))
);

const router = new Router();

const port = process.env.PORT || 3000;

const render = views(path.join(__dirname, './templates/views/'), {
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

router.use('/', globalRouter.router.routes());

app.use(router.routes());

app.listen(port, () => {
  console.log(`I was born :-) ${port}`);
});

const Koa = require('koa');
const path = require('path');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const usersRouter = require('./users/users.router');
const passport = require('./libs/passport/koaPassport');

passport.initialize();
const app = new Koa();

app.use(bodyParser());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.isJoi) {
      ctx.throw(400, err.details[0].message);
    }
    if (err.isPassport) {
      ctx.throw(401, err.message);
    }
    console.log('this error =>', err.message);
    ctx.throw(400, err.message);
  }
});

const router = new Router();

const port = process.env.PORT || 3000;

router.use('/', usersRouter.router.routes());

app.use(router.routes());

app.listen(port, () => {
  console.log(`I was born :-) ${port}`);
});

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const usersRouter = require('./users/users.router');
const categoriesRouter = require('./categories/categories.router');
const passport = require('./libs/passport/koaPassport');
const { errorCatcher } = require('./middlwares/errorCatcher');

passport.initialize();
const app = new Koa();

app.use(bodyParser());

app.use(errorCatcher);

const router = new Router();

const port = process.env.PORT || 3000;

router.use('/', usersRouter.router.routes(), categoriesRouter.router.routes());

app.use(router.routes());

app.listen(port, () => {
  console.log(`I was born :-) ${port}`);
});

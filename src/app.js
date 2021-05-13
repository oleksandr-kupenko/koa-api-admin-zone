const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');

const usersRouter = require('./users/users.router');
const categoriesRouter = require('./categories/categories.router');
const passport = require('./libs/passport/koaPassport');
const { errorCatcher } = require('./middlwares/errorCatcher');

passport.initialize();
const app = new Koa();

app.use(bodyParser());
app.use(cors());
app.use(errorCatcher);

const port = process.env.PORT || 3000;

const router = new Router();

router.use('/users', usersRouter);
router.use('/categories', categoriesRouter);

app.use(router.middleware());

app.listen(port, () => {
  console.log(`I was born :-) ${port}`);
});

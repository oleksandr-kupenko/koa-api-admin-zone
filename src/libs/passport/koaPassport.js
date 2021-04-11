const passport = require('koa-passport');

passport.use(require('./jwtStrategy'));
passport.use(require('./localStrategy'));

module.exports = passport;

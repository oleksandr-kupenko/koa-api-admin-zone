const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const { UserDB } = require('../../users/models/UserDB');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: 'super_secret',
};

module.exports = new JwtStrategy(opts, (jwtPayload, done) => {
  if (jwtPayload.expiresIn <= new Date().getTime()) {
    done({ isPassport: true, message: 'Expired access token.' }, false);
  }

  UserDB.getUserById(jwtPayload.id)
    .then((user) => {
      done(null, user.getAuthInfo())
    })
    .catch((err) => done({ isPassport: true, message: err.message }, false));
});

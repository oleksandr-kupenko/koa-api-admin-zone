const LocalStrategy = require('passport-local');
const jwt = require('jwt-simple');

const { UserDB } = require('../../users/models/UserDB');

const opts = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
  session: false,
};

module.exports = new LocalStrategy(opts, async (req, email, password, done) => {
  UserDB.checkPassword(email, password)
    .then((checkPasswordResponse) => {
      if (!checkPasswordResponse.flag) {
        return done({ message: checkPasswordResponse.message }, false);
      }

      const { user } = checkPasswordResponse;

      const accessToken = {
        id: user.id,
        expiresIn: new Date().setTime(new Date().getTime() + 200000),
      };
      const refreshToken = {
        email: user.email,
        expiresIn: new Date().setTime(new Date().getTime() + 1000000),
      };

      user.tokens = {
        accessToken: jwt.encode(accessToken, 'super_secret'),
        accessTokenExpirationDate: accessToken.expiresIn,
        refreshToken: jwt.encode(refreshToken, 'super_secret_refresh'),
        refreshTokenExpirationDate: refreshToken.expiresIn,
      };

      return done(null, checkPasswordResponse.user);
    })
    .catch((err) => done({ message: err.message }, false));
});

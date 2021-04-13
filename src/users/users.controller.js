const dotenv = require('dotenv');
const passport = require('koa-passport');
const crypto = require('crypto');
const jwt = require('jwt-simple');

const { UserDB } = require('./models/UserDB');
const User = require('./models/User');
const validatorUsers = require('./users.validator');

dotenv.config();

const controllers = {
  async getUser(ctx) {
    const userId = ctx.request.params.userId;
    const user = await UserDB.getUserById(userId);
    console.log(user);
    ctx.body = user;
  },

  async getUsersList(ctx) {
    const users = (await UserDB.getAllUsers()).map((user) => user.getAuthInfo());
    console.log(...users);
    ctx.body = {
      ...users,
    };
  },

  async createUser(ctx) {
    const { body } = ctx.request;
    await validatorUsers.usersSchema.validateAsync(body);
    body.password = crypto.pbkdf2Sync(body.password, process.env.SEKRET_KEY, 100000, 64, 'sha256').toString('hex');
    const newUser = await UserDB.saveUser(body);
    ctx.status = 201;
    ctx.body = await newUser.getAuthInfo();
  },

  async deleteUser(ctx) {
    const { body } = ctx.request;
    await UserDB.deleteUser(body.userId);
    ctx.status = 204;
  },

  async signIn(ctx, next) {
    await passport.authenticate('local', (err, user) => {
      if (user) {
        ctx.body = new User(user).getAuthInfo();
      } else {
        ctx.status = 400;
        if (err) {
          ctx.body = { error: err };
        }
      }
    })(ctx, next);
  },

  async profile(ctx) {
    console.log(ctx.state);
    ctx.body = ctx.state.user;
  },

  async refreshToken(ctx) {
    const token = ctx.headers.authorization.split(' ')[1];
    const decodedToken = jwt.decode(token, process.env.SEKRET_KEY_REFRESH);

    if (decodedToken.expiresIn <= new Date().getTime()) {
      const error = new Error('Refresh token expired, please sign in into your account.');
      error.status = 400;
      throw error;
    }

    const user = await UserDB.getUserByEmail(decodedToken.email);

    const accessToken = {
      id: user.getId(),
      expiresIn: new Date().setTime(new Date().getTime() + 200000),
    };

    const refreshToken = {
      email: user.getEmail(),
      expiresIn: new Date().setTime(new Date().getTime() + 1000000),
    };

    ctx.body = {
      accessToken: jwt.encode(accessToken, process.env.SEKRET_KEY),
      accessTokenExpirationDate: accessToken.expiresIn,
      refreshToken: jwt.encode(refreshToken, process.env.SEKRET_KEY_REFRESH),
      refreshTokenExpirationDate: refreshToken.expiresIn,
    };
  },
};

module.exports = { controllers };

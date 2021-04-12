const db = require('../db/db');
const validatorUsers = require('./users.validator');
const dotenv = require('dotenv');
const passport = require('koa-passport');
const crypto = require('crypto');
const jwt = require('jwt-simple');
const { UserDB } = require('./models/UserDB');
const User = require('./models/User');

dotenv.config();

const controllers = {
  async getUser(ctx) {
    const userId = ctx.request.params.userId;
    const user = await UserDB.getUserById(userId);
    ctx.body = user.getAuthInfo();
  },

  async getUsersList(ctx) {
    const users = await UserDB.getUsers();
    ctx.body = {
      users,
    };
  },

  async createUser(ctx) {
    const { body } = ctx.request;
    await validatorUsers.usersSchema.validateAsync(body);
    body.password = crypto.pbkdf2Sync(body.password, 'salt', 100000, 64, 'sha256').toString('hex');
    const newUser = await UserDB.saveUser(body);
    ctx.status = 201;
    ctx.body = newUser.getAuthInfo();
  },

  async deleteUser(ctx) {
    const { body } = ctx.request;
    console.log(body.userId);
    const deletedUser = await UserDB.deleteUser(body.userId);
    console.log(deletedUser);
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
    ctx.body = {
      user: ctx.state.user,
    };
  },

  async refreshToken(ctx) {
    const token = ctx.headers.authorization.split(' ')[1];
    const decodedToken = jwt.decode(token, 'super_secret_refresh');

    if (decodedToken.expiresIn <= new Date().getTime()) {
      const error = new Error('Refresh token expired, please sign in into your account.');
      error.status = 400;
      throw error;
    }

    const user = await UserDB.getUserByEmail(decodedToken.email);

    const accessToken = {
      id: user.id,
      expiresIn: new Date().setTime(new Date().getTime() + 200000),
    };

    const refreshToken = {
      email: user.email,
      expiresIn: new Date().setTime(new Date().getTime() + 1000000),
    };

    ctx.body = {
      accessToken: jwt.encode(accessToken, 'super_secret'),
      accessTokenExpirationDate: accessToken.expiresIn,
      refreshToken: jwt.encode(refreshToken, 'super_secret_refresh'),
      refreshTokenExpirationDate: refreshToken.expiresIn,
    };
  },
};

module.exports = { controllers };

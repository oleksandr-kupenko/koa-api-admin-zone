const dotenv = require('dotenv');
const passport = require('koa-passport');
const crypto = require('crypto');
const jwt = require('jwt-simple');

const { UserDB } = require('./models/UserDB');
const User = require('./models/User');
const AWSS3 = require('../utils/uploadS3');

dotenv.config();

const UsersController = {
  async getUser(ctx) {
    const userId = ctx.request.params.userId;
    const user = await UserDB.getUserById(userId);
    ctx.body = user.getInfo();
  },

  async getUsersList(ctx) {
    const idflag = true;
    const users = (await UserDB.getAllUsers(ctx.query)).map((user) => user.getInfo(idflag));
    ctx.body = users;
  },

  async getCountUsers(ctx) {
    const count = await UserDB.getCountUsers(ctx.query.search);
    ctx.body = count;
  },

  async createUser(ctx) {
    const { body } = ctx.request;
    body.password = crypto.pbkdf2Sync(body.password, process.env.SECRET_KEY, 100000, 64, 'sha256').toString('hex');
    const newUser = await UserDB.createUser(body);
    ctx.status = 201;
    ctx.body = await newUser.getInfo();
  },

  async deleteUser(ctx) {
    const { body } = ctx.request;
    await UserDB.deleteUser(body.userId);
    ctx.status = 204;
  },

  async signIn(ctx, next) {
    await passport.authenticate('local', (err, user) => {
      if (user) {
        ctx.body = new User(user).getInfo();
      } else {
        ctx.status = 400;
        if (err) {
          ctx.body = { error: err };
        }
      }
    })(ctx, next);
  },

  async refreshToken(ctx) {
    const token = ctx.headers.authorization.split(' ')[1];
    const decodedToken = jwt.decode(token, process.env.SECRET_KEY_REFRESH);

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
      accessToken: jwt.encode(accessToken, process.env.SECRET_KEY),
      accessTokenExpirationDate: accessToken.expiresIn,
      refreshToken: jwt.encode(refreshToken, process.env.SECRET_KEY_REFRESH),
      refreshTokenExpirationDate: refreshToken.expiresIn,
    };
  },

  async getUserByEmail(ctx) {
    console.log(ctx.query.email);
    const email = ctx.query.email;

    const user = await UserDB.getUserByEmail(email);
    ctx.status = 201;
    const idflag = true;
    const id = user.getInfo(idflag).id;
    ctx.body = { id };
  },

  async getUsersFromCategoryById(ctx) {
    console.log(ctx.request.params);
    const categoryId = ctx.request.params.catId;
    const usersFromCategory = await UserDB.getUsersFromCategoryById(categoryId);
    ctx.status = 201;
    ctx.body = usersFromCategory.map((user) => user.getInfo());
  },

  async getUsersFromCategoryByName(ctx) {
    console.log(ctx.request.params);
    const categoryName = ctx.request.params.catName;
    const usersFromCategory = await UserDB.getUsersFromCategoryByName(categoryName);
    ctx.status = 201;
    ctx.body = usersFromCategory.map((user) => user.getInfo());
  },

  async updatePhoto(ctx) {
    const email = ctx.request.body.email ? ctx.request.body.email : ctx.state.user.email;
    const photoUrl = await AWSS3.uploadS3(ctx.request.body.photo, 'users', `photos_${email}`);

    await UserDB.updateUserPhoto(photoUrl, email);
    ctx.body = { photoUrl };
  },

  async getProfile(ctx) {
    ctx.status = 201;
    ctx.body = ctx.state.user;
  },

  async updateProfile(ctx) {
    const { body } = ctx.request;
    const updatedUser = await UserDB.updateUser(body);
    ctx.status = 201;
    ctx.body = await updatedUser.getInfo();
  },

  async updateRating(ctx) {
    const { body } = ctx.request;
    console.log(body);
    const updatedUser = await UserDB.updateUserRating(body);
    ctx.status = 201;
    ctx.body = await updatedUser.getInfo();
  },

  async updateStatusAdmin(ctx) {
    const { body } = ctx.request;
    const updatedUser = await UserDB.updateUserStatusAdmin(body);
    ctx.status = 201;
    ctx.body = await updatedUser.getInfo();
  },

  async resetPassword(ctx) {
    const { body } = ctx.request;
    body.password = crypto.pbkdf2Sync(body.password, process.env.SECRET_KEY, 100000, 64, 'sha256').toString('hex');
    const updatedUser = await UserDB.resetPassword(body);
    ctx.status = 201;
    ctx.body = await updatedUser.getInfo();
  },
};

module.exports = { UsersController };

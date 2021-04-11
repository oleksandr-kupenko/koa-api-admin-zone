const db = require('../db/db');
const validatorUsers = require('./users.validator');
const dotenv = require('dotenv');
const passport = require('koa-passport');
const crypto = require('crypto');
const jwt = require('jwt-simple');

dotenv.config();

const conrollersList = {
  async getUser(ctx) {
    const userId = ctx.request.params.userId;
    const userResponse = await db.query(`SELECT u.fname, u.lname, u.country, c.name
    FROM "users" u
    JOIN categories c
    ON u."categoryId" = c.id
    where u.id = ${userId}
    GROUP BY u.fname, u.lname, u.country, c.name`);
    if (!userResponse.rowCount) {
      ctx.throw(400, 'Usera nema, sorry');
    }
    const user = userResponse.rows[0];
    ctx.body = {
      user,
    };
  },

  async usersList(ctx) {
    const usersResponse = await db.query(`SELECT u.fname, u.lname, u.email, u.country, u."isRequested", c.name, u.id
    FROM "users" u
    JOIN categories c
    ON u."categoryId" = c.id
    GROUP BY u.fname, u.lname, u.country, u."isRequested", c.name, u.email, u.id`);
    const users = usersResponse.rows;
    ctx.body = {
      users,
    };
  },

  async createUser(ctx) {
    const { body } = ctx.request;
    await validatorUsers.usersSchema.validateAsync(body);
    body.password = crypto.pbkdf2Sync(body.password, 'salt', 100000, 64, 'sha256').toString('hex');
    console.log(body.password);
    const createUserResponse = await db
      .query(
        `INSERT INTO "users" (fname, lname, "isRequested", "categoryId", email, password) VALUES ('${body.fname}', 
      '${body.lname}', '${body.isRequested}', '${body.categoryId}', '${body.email}', '${body.password}') RETURNING *`
      )
      .catch((err) => {
        if (err.constraint === 'user_email') {
          throw new Error('User with the same email already exists');
        }
        console.log('other error');
        throw new Error(err.message);
      });

    const user = { ...createUserResponse.rows[0] };
    ctx.status = 201;
    ctx.body = {
      id: user.id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      country: user.country,
      category: user.categoryId,
    };
  },

  async deleteUser(ctx) {
    const { body } = ctx.request;
    const userId = ctx.request.params.userId;
    await db.query(`DELETE FROM users WHERE id = ${body.userId}`);
    ctx.status = 204;
    ctx.body = 'deltetd';
  },

  async signIn(ctx, next) {
    await passport.authenticate('local', (err, user) => {
      if (user) {
        ctx.body = user;
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

module.exports = { conrollersList };

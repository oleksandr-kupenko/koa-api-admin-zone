const db = require('./db/db');
const validatorUsers = require('./validator');
const helpers = require('./helpers');
const dotenv = require('dotenv');

dotenv.config();

const conrollerCreator = {
  async index(ctx) {
    await ctx.render('index');
  },
  async sign1(ctx) {
    await ctx.render('sign-1');
  },
  async sign2(ctx) {
    await ctx.render('sign-2');
  },
  async sign3(ctx) {
    await ctx.render('sign-3');
  },
  async sign4(ctx) {
    await ctx.render('sign-4');
  },
  async signUp1(ctx) {
    await ctx.render('sign-up-1');
  },
  async signUp2(ctx) {
    await ctx.render('sign-up-2');
  },
  async signUp3(ctx) {
    await ctx.render('sign-up-3');
  },
  async signUp4(ctx) {
    await ctx.render('sign-up-4');
  },
  async signUp5(ctx) {
    await ctx.render('sign-up-5');
  },
  async signUp6(ctx) {
    await ctx.render('sign-up-6');
  },
  async profile1(ctx) {
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
    const name = userResponse.rows[0].name;

    await ctx.render('profile-1', { categoryName: name, userName: userResponse.rows[0] });
  },
  async profile2(ctx) {
    await ctx.render('profile-2');
  },
  async search1(ctx) {
    await ctx.render('search-1');
  },
  async search2(ctx) {
    await ctx.render('search-2', { mapKey: process.env.mapKey });
  },
  async admin(ctx) {
    const usersResponse = await db.query(`SELECT u.fname, u.lname, u.email, u.country, u."isRequested", c.name, u.id
    FROM "users" u
    JOIN categories c
    ON u."categoryId" = c.id
    GROUP BY u.fname, u.lname, u.country, u."isRequested", c.name, u.email, u.id`);
    const categoiesResponse = await db.query('SELECT * FROM categories');
    await ctx.render('admin', { usersArr: usersResponse.rows, categoriesArr: categoiesResponse.rows });
  },
};

async function createUserForm(ctx) {
  await ctx.render('create-user');
}

async function createUser(ctx) {
  const { body } = ctx.request;

  await validatorUsers.usersSchema.validateAsync(body);

  const createUserResponse = await db.query(
    `INSERT INTO "users" (fname, lname, "isRequested", "categoryId", email) VALUES ('${body.fname}', 
    '${body.lname}', '${body.isRequested}', '${body.categoryId}', '${body.email}') RETURNING *`
  );
  const user = { ...createUserResponse.rows[0] };
  try {
    await ctx.redis.set(user.id, JSON.stringify(user));
    console.log(await ctx.redis.get(user.id));
  } catch (err) {
    throw err;
  }

  ctx.status = 201;
  ctx.body = {
    id: user.id,
    fname: user.fname,
    lname: user.lname,
    email: user.email,
    country: user.country,
    category: helpers.statusName(user.categoryId),
  };
}

async function deleteUser(ctx) {
  const { body } = ctx.request;
  const userId = ctx.request.params.userId;
  await ctx.redis.del(body.userId);
  await db.query(`DELETE FROM users WHERE id = ${body.userId}`);
  ctx.status = 204;
  ctx.body = 'deltetd';
}

module.exports = { conrollerCreator, createUserForm, createUser, deleteUser };

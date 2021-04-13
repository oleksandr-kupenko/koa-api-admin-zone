const crypto = require('crypto');

const db = require('../../db/db');
const User = require('./User');

class UserDB {
  static async getUserById(id) {
    console.log('get user by id');
    const userResponse = await db.query(`SELECT * FROM "users" WHERE id = ${id}`);
    if (!userResponse.rowCount) {
      throw new Error(`User with id: ${id}, does not exist`);
    }

    return new User(userResponse.rows[0]);
  }

  static async getAllUsers() {
    const usersResponse = await db.query(`SELECT u.fname, u.lname, u.email, u.country, u."isRequested", c.name, u.id
        FROM "users" u
        JOIN categories c
        ON u."categoryId" = c.id
        GROUP BY u.fname, u.lname, u.country, u."isRequested", c.name, u.email, u.id`);
    const users = usersResponse.rows.map((user) => new User(user));

    return users;
  }

  static async createUser(body) {
    const createUserResponse = await db
      .query(
        `INSERT INTO "users" (fname, lname, "isRequested", "categoryId", country, email, password) VALUES ('${body.fname}', 
      '${body.lname}', '${body.isRequested}', '${body.categoryId}', '${body.country}', '${body.email}', '${body.password}') RETURNING *`
      )
      .catch((err) => {
        if (err.constraint === 'users_email_key') {
          const error = new Error(`User with ${body.email} email already exists`);
          error.status = 400;
          throw error;
        }
        throw new Error(err.message);
      });
    return new User(createUserResponse.rows[0]);
  }

  static async deleteUser(id) {
    const userResponse = await db.query(`DELETE FROM users WHERE id = ${id}`);
    if (!userResponse.rowCount) {
      throw new Error(`User with id: ${id}, does not exist`);
    }
    return 'deleted';
  }

  static async getUserByEmail(email) {
    console.log('get user by email');
    const userResponse = await db.query(`SELECT * FROM "users" WHERE email = '${email}'`);

    if (!userResponse.rowCount) {
      throw new Error(`User with email: ${email}, does not exist`);
    }

    return new User(userResponse.rows[0]);
  }

  static async checkPassword(email, password) {
    console.log('check password');
    const userResponse = await db.query(`SELECT * FROM "users" WHERE email = '${email}'`);

    if (!userResponse.rowCount) {
      return { message: `User with email: ${email}, does not exist`, flag: false };
    }

    const user = { ...userResponse.rows[0] };

    if (crypto.pbkdf2Sync(password, 'salt', 100000, 64, 'sha256').toString('hex') !== user.password) {
      return { message: 'Incorect password', flag: false };
    }

    return { user: new User(user), flag: true };
  }

  static async getUsersFromCategoryById(id) {
    const categoryResponse = await db.query(
      `SELECT u.fname, u.lname, u.email, u.country, u."isRequested", c.name, u.id
      FROM "users" u
      JOIN categories c
      ON c."id" = ${id}
      GROUP BY u.fname, u.lname, u.country, u."isRequested", c.name, u.email, u.id`
    );

    if (!categoryResponse.rowCount) {
      throw new Error(`Category with id: ${id}, does not exist`);
    }

    const users = categoryResponse.rows.map((user) => new User(user));
    return users;
  }

  static async getUsersFromCategoryByName(name) {
    const categoryResponse = await db.query(
      `SELECT u.fname, u.lname, u.email, u.country, u."isRequested", c.name, u.id
      FROM "users" u
      JOIN categories c
      ON c.name LIKE '${name}'
      GROUP BY u.fname, u.lname, u.country, u."isRequested", c.name, u.email, u.id`
    );

    if (!categoryResponse.rowCount) {
      throw new Error(`Category with id: ${name}, does not exist`);
    }

    const users = categoryResponse.rows.map((user) => new User(user));
    return users;
  }
}

module.exports = { UserDB };

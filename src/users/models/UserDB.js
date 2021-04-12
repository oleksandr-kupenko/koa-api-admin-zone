const crypto = require('crypto');
const db = require('../../db/db');
const User = require('./User');

class UserDB {
  static async getUserById(id) {
    const userResponse = await db.query(`SELECT * FROM "users" WHERE id = ${id}`);
    if (!userResponse.rowCount) {
      throw new Error(`User with id: ${id}, does not exist`);
    }
    const user = userResponse.rows[0];
    return new User(user);
  }

  static async getUsers() {
    const usersResponse = await db.query(`SELECT u.fname, u.lname, u.email, u.country, u."isRequested", c.name, u.id
        FROM "users" u
        JOIN categories c
        ON u."categoryId" = c.id
        GROUP BY u.fname, u.lname, u.country, u."isRequested", c.name, u.email, u.id`);
    const users = usersResponse.rows;
    return users;
  }

  static async saveUser(body) {
    const saveUserResponse = await db
      .query(
        `INSERT INTO "users" (fname, lname, "isRequested", "categoryId", email, password) VALUES ('${body.fname}', 
      '${body.lname}', '${body.isRequested}', '${body.categoryId}', '${body.email}', '${body.password}') RETURNING *`
      )
      .catch((err) => {
        if (err.constraint === 'user_email') {
          throw new Error('User with the same email already exists');
        }
        throw new Error(err.message);
      });

    const newUser = saveUserResponse.rows[0];

    return new User(newUser);
  }

  static async deleteUser(id) {
    const userResponse = await db.query(`DELETE FROM users WHERE id = ${id}`);
    if (!userResponse.rowCount) {
      throw new Error(`User with id: ${id}, does not exist`);
    }
    return 'deleted';
  }

  static async getUserByEmail(email) {
    const userResponse = await db.query(`SELECT * FROM "users" WHERE email = '${email}'`);

    if (!userResponse.rowCount) {
      throw new Error(`User with email: ${email}, does not exist`);
    }

    const user = userResponse.rows[0];

    return new User(user);
  }

  static async checkPassword(email, password) {
    const userResponse = await db.query(`SELECT * FROM "users" WHERE email = '${email}'`);

    if (!userResponse.rowCount) {
      return { message: `User with email: ${email}, does not exist`, flag: false };
    }

    const user = { ...userResponse.rows[0] };

    if (crypto.pbkdf2Sync(password, 'salt', 100000, 64, 'sha256').toString('hex') !== user.password) {
      return { message: 'Incorect password', flag: false };
    }

    return { user, flag: true };
  }
}

module.exports = { UserDB };

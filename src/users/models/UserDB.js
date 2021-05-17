const crypto = require('crypto');

const db = require('../../db/db');
const User = require('./User');

class UserDB {
  static async getUserById(id) {
    const userResponse = await db.query(`SELECT u.fname, u.lname, u.username, u.email, u.country, u."isAdmin", 
    u.gender, u.phone, u."categoryId", u.photo, c.name, u.stack, u.rate, u.rating
    FROM "users" u
    JOIN categories c
    ON u.id =  ${id}
    WHERE u."categoryId" = c.id
    GROUP BY u.fname, u.lname, u.country, u."isAdmin", c.name, u.email, u.id, u.stack, u.rating`);
    if (!userResponse.rowCount) {
      throw new Error(`User with id: ${id}, does not exist`);
    }

    return new User(userResponse.rows[0]);
  }

  static async getAllUsers({ min, max, search, country, category, stack, sort }) {
    console.log(max);
    const usersResponse = await db.query(`SELECT u.fname, u.lname, u.email, u.country, u."isAdmin", 
      c.name, u.id, u.rate, u.rating, u.photo, u.phone, u.gender, u.stack
        FROM "users" u
        JOIN categories c
        ON u."categoryId" = c.id
        WHERE u.country ILIKE '%${country}%' AND 
        CONCAT (u.fname,' ',u.lname) ILIKE '%${search}%' ${stack ? `AND u.stack ILIKE '%${stack}%'` : ''} 
        ${category ? ` AND u."categoryId" = ${category}` : ''} 
          GROUP BY u.fname, u.lname, u.country, u."isAdmin", c.name, u.email, u.id, u."categoryId", u.rate
          ORDER BY ${sort ? 'u.rate' : 'u.rating'} ASC
        OFFSET ${min} LIMIT ${max}`);

    const users = usersResponse.rows.map((user) => new User(user));

    return users;
  }

  static async getCountUsers(search) {
    const countResponse = await db.query(`SELECT COUNT(*) FROM users WHERE 
    CONCAT (fname,' ',lname) ILIKE '%${search}%'
    `);
    const count = countResponse.rows[0];

    return count;
  }

  static async createUser(body) {
    const createUserResponse = await db
      .query(
        `INSERT INTO "users" (fname, lname, username, email, password) 
        VALUES ('${body.fname}', '${body.lname}', '${body.username}', 
        '${body.email}', '${body.password}') RETURNING *`
      )
      .catch((err) => {
        if (err.constraint === 'users_email_key') {
          const error = new Error(`User with ${body.email} email already exists`);
          error.status = 400;
          throw error;
        }
        if (err.constraint === 'user_username') {
          const error = new Error(`User with ${body.username} username already exists`);
          error.status = 400;
          throw error;
        }
        throw new Error(err.message);
      });
    return new User(createUserResponse.rows[0]);
  }

  static async updateUser(body) {
    const updateUserResponse = await db
      .query(
        `UPDATE users
        SET fname = '${body.fname}',
            lname = '${body.lname}',
            username = '${body.username ? body.username : ''}',
            gender = '${body.gender}',
            "categoryId" = '${body.categoryId}',
            country = '${body.country}',
            email = '${body.email}',
            phone = '${body.phone}',
            stack = '${body.stack}',
            rate = '${body.rate}'
        WHERE email = '${body.email}' 
        RETURNING *`
      )
      .catch((err) => {
        if (err.constraint === 'users_email_key') {
          const error = new Error(`User with ${body.email} email already exists`);
          error.status = 400;
          throw error;
        }
        if (err.constraint === 'user_username') {
          const error = new Error(`User with ${body.username} username already exists`);
          error.status = 400;
          throw error;
        }
        throw new Error(err.message);
      });
    return new User(updateUserResponse.rows[0]);
  }

  static async resetPassword(body) {
    const resetPasswordResponse = await db.query(
      `UPDATE users
      SET password = '${body.password}'   
      WHERE id = '${body.id}' 
      RETURNING *`
    );
    return new User(resetPasswordResponse.rows[0]);
  }

  static async updateUserRating(body) {
    const updateUserRatingResponse = await db.query(
      `UPDATE users
      SET rating = '${body.rating}'   
      WHERE id = '${body.id}' 
      RETURNING *`
    );
    return new User(updateUserRatingResponse.rows[0]);
  }

  static async updateUserStatusAdmin(body) {
    const updateUserStatusAdminResponse = await db.query(
      `UPDATE users
      SET "isAdmin" = '${body.status}'   
      WHERE id = '${body.id}' 
      RETURNING *`
    );
    return new User(updateUserStatusAdminResponse.rows[0]);
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
      throw new Error(`User with email ${email} does not exist`);
    }

    return new User(userResponse.rows[0]);
  }

  static async checkPassword(email, password) {
    console.log('check password');
    const userResponse = await db.query(`SELECT * FROM "users" WHERE email = '${email}'`);

    if (!userResponse.rowCount || userResponse.rowCount === 0) {
      return { message: `User with email ${email} does not exist`, flag: false };
    }

    const user = { ...userResponse.rows[0] };

    if (crypto.pbkdf2Sync(password, 'salt', 100000, 64, 'sha256').toString('hex') !== user.password) {
      return { message: 'Incorect password', flag: false };
    }

    return { user: new User(user), flag: true };
  }

  static async getUsersFromCategoryById(id) {
    const categoryResponse = await db.query(
      `SELECT u.fname, u.lname, u.email, u.country, u."isAdmin", c.name, u.id
      FROM "users" u
      JOIN categories c
      ON c."id" = ${id}
      GROUP BY u.fname, u.lname, u.country, u."isAdmin", c.name, u.email, u.id`
    );

    if (!categoryResponse.rowCount) {
      throw new Error(`Category with id: ${id}, does not exist`);
    }

    const users = categoryResponse.rows.map((user) => new User(user));
    return users;
  }

  static async getUsersFromCategoryByName(name) {
    const categoryResponse = await db.query(
      `SELECT u.fname, u.lname, u.email, u.country, u."isAdmin", c.name, u.id
      FROM "users" u
      JOIN categories c
      ON c.name LIKE '${name}'
      GROUP BY u.fname, u.lname, u.country, u."isAdmin", c.name, u.email, u.id`
    );

    if (!categoryResponse.rowCount) {
      throw new Error(`Category with id: ${name}, does not exist`);
    }

    const users = categoryResponse.rows.map((user) => new User(user));
    return users;
  }

  static async updateUserPhoto(photoUrl, email) {
    const user = await db.query(`
    UPDATE "users" SET photo = '${photoUrl}' WHERE email = '${email}'
    `);
    return user;
  }
}

module.exports = { UserDB };

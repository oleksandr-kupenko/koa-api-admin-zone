const crypto = require('crypto');
const db = require('../../db/db');
const User = require('./User')

class UserDB {
    static async getUserById(id) {
        const userResponse = await db.query(`SELECT * FROM "users" WHERE id = ${id}`);

        if (!userResponse.rowCount) {
            throw new Error(`User with id: ${id}, does not exist`);
        }       
        let user = userResponse.rows[0];
     
        return new User(...Object.values(user));
    }

    static async getUserByEmail(email) {
        const userResponse = await db.query(`SELECT * FROM "users" WHERE email = '${email}'`);

        if (!userResponse.rowCount) {
            throw new Error(`User with email: ${email}, does not exist`);
        }

        let user = userResponse.rows[0];
     
        return new User(...Object.values(user));
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

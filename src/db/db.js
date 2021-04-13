const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

class Database {
  constructor() {
    this.config = {
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      host: 'localhost',
      port: 5432,
    };
    this.poll = new Pool(this.config);
  }

  query(sql) {
    return this.poll.query(sql);
  }

  close() {
    return this.poll.end;
  }
}

// const pool = new Pool({});

module.exports = new Database();

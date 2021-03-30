const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

class Database {
  constructor() {
    this.config = {
      database: process.env.DB_NAME,
      user: process.env.DB_NAME,
      password: process.env.DB_PASS,
      host: '34.116.221.173',
    };
    this.poll = new Pool(this.config);
  }
  query(sql) {
    return this.poll.query(sql);
  }
  close() {
    this.poll.end;
  }
}

const pool = new Pool({});

module.exports = new Database();

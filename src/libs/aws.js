const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

const options = {
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
};

AWS.config.update(options);

module.exports = AWS;

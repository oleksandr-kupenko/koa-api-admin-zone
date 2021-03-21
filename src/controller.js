const dotenv = require('dotenv');
dotenv.config();

const conrollerCreator = (page) => {
  const controller = async (ctx) => {
    await ctx.render(page, {
      name: process.env.STELLA,
    });
  };
  return controller;
};

module.exports = { conrollerCreator };

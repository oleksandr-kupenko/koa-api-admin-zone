const dotenv = require('dotenv');
dotenv.config();

const conrollerCreator = (page) => {
  const controller = async (ctx) => {
    await ctx.render(page, {
      mapKey: process.env.mapKey,
    });
  };
  return controller;
};

module.exports = { conrollerCreator };

const Router = require('koa-joi-router');

const Joi = Router.Joi;

exports.createCategory = {
  validate: {
    type: 'json',
    body: {
      name: Joi.string().min(3).max(255).required(),
    },
    output: {
      201: {
        body: {
          id: Joi.number(),
          name: Joi.string().min(3).max(255).required(),
        },
      },
    },
  },
};

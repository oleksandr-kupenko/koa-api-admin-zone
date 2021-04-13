const Router = require('koa-joi-router');

const Joi = Router.Joi;

const userSchema = {
  email: Joi.string().min(3).max(255).required(),
};

exports.signIn = {
  validate: {
    type: 'json',
    body: {
      ...userSchema,
      password: Joi.string().min(4).required(),
    },
  },
};

exports.signUp = {
  validate: {
    type: 'json',
    body: {
      ...userSchema,
      fname: Joi.string().min(3).max(255).required(),
      lname: Joi.string().min(3).max(255).required(),
      categoryId: Joi.number().required(),
      country: Joi.string().max(255).required(),
      isRequested: Joi.bool().required(),
      password: Joi.string().min(4).required(),
    },
    output: {
      201: {
        body: {
          ...userSchema,
          id: Joi.number(),
          fname: Joi.string().min(3).max(255).required(),
          lname: Joi.string().min(3).max(255).required(),
          categoryId: Joi.number().required(),
          country: Joi.string().required(),
          isRequested: Joi.bool().required(),
        },
      },
    },
  },
};

exports.getUsersFromCategoryById = {
  validate: {
    type: 'json',
    body: {
      categoryId: Joi.number().required(),
    },
  },
};

exports.getUsersFromCategoryByName = {
  validate: {
    type: 'json',
    body: {
      categoryName: Joi.string().required(),
    },
  },
};

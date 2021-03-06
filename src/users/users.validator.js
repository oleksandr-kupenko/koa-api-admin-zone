const Router = require('koa-joi-router');

const Joi = Router.Joi;

const userOutSchema = {
  id: Joi.number(),
  email: Joi.string().min(3).max(255).required(),
  fname: Joi.string().min(3).max(255).required(),
  lname: Joi.string().min(3).max(255).required(),
  categoryId: Joi.number().required(),
  isAdmin: Joi.bool(),
  username: Joi.string().min(3).max(255).required(),
  categoryName: Joi.string(),
  country: Joi.string(),
  stack: Joi.string().allow(null, ''),
  photo: Joi.string().allow(null, ''),
  phone: Joi.string().allow(null, ''),
  gender: Joi.string().allow(null, ''),
  rate: Joi.number().allow(null, ''),
  rating: Joi.number().allow(null, ''),
};

exports.signIn = {
  validate: {
    type: 'json',
    body: {
      email: Joi.string().min(3).max(255).required(),
      password: Joi.string().min(4).required(),
    },
  },
};

exports.email = {
  validate: {
    query: {
      email: Joi.string().min(3).max(255).required(),
    },
  },
};

exports.signUp = {
  validate: {
    type: 'json',
    body: {
      email: Joi.string().min(3).max(255).required(),
      username: Joi.string().min(3).max(255).required(),
      fname: Joi.string().min(3).max(255).required(),
      lname: Joi.string().min(3).max(255).required(),
      password: Joi.string().min(4).required(),
    },
    output: {
      201: {
        body: {
          ...userOutSchema,
        },
      },
    },
  },
};

exports.getUsersFromCategoryById = {
  validate: {
    request: {
      params: {
        catId: Joi.number().required(),
      },
    },
  },
};

exports.getUsersFromCategoryByName = {
  validate: {
    request: {
      params: {
        catName: Joi.string().required(),
      },
    },
  },
};

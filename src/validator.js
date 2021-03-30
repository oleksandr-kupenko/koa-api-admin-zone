const Joi = require('joi');

const usersSchema = Joi.object({
  fname: Joi.string().min(3).max(255).required(),
  lname: Joi.string().min(3).max(255).required(),
  email: Joi.string().min(3).max(255).required(),
  categoryId: Joi.number().integer().max(5).required(),
  isRequested: Joi.bool().required(),
});

module.exports = {
  usersSchema,
};

const Joi = require('joi');

const categoriesSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
});

module.exports = {
  categoriesSchema,
};

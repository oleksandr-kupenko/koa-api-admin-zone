const db = require('../db/db');
const validatorCategories = require('./categories.validator');
const { CategoryDB } = require('./models/CategoryDB');

const controllers = {
  async getCategory(ctx) {
    const categoryId = ctx.request.params.categoryId;
    const category = await CategoryDB.getCategoryById(categoryId);
    ctx.body = category;
  },

  async getCategoriesList(ctx) {
    const categories = await CategoryDB.getCategories();
    ctx.body = {
      categories,
    };
  },

  async createCategory(ctx) {
    const { body } = ctx.request;
    await validatorCategories.categoriesSchema.validateAsync(body);
    const category = await CategoryDB.saveCategory(body);
    ctx.status = 201;
    ctx.body = category;
  },

  async deleteCategory(ctx) {
    const { body } = ctx.request;
    const deletedCategory = await CategoryDB.deleteCategory(body.categoryId);
    console.log(deletedCategory);
    ctx.status = 204;
  },

  async getUsersFromCategoryById(ctx) {
    const { body } = ctx.request;
    const usersFromCategory = await CategoryDB.getUsersFromCategoryById(body.categoryId);
    ctx.status = 201;
    ctx.body = usersFromCategory;
  },

  async getUsersFromCategoryByName(ctx) {
    const { body } = ctx.request;
    console.log(body);
    const usersFromCategory = await CategoryDB.getUsersFromCategoryByName(body.categoryName);
    ctx.status = 201;
    ctx.body = usersFromCategory;
  },
};

module.exports = { controllers };

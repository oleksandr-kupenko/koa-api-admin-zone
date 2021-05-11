const { CategoryDB } = require('./models/CategoryDB');

const controllers = {
  async getCategory(ctx) {
    const categoryId = ctx.request.params.categoryId;
    const category = await CategoryDB.getCategoryById(categoryId);
    ctx.body = category;
  },

  async getCategoriesList(ctx) {
    const categories = await CategoryDB.getCategories();
    ctx.body = categories;
  },

  async createCategory(ctx) {
    const { body } = ctx.request;
    const category = await CategoryDB.saveCategory(body);
    ctx.status = 201;
    ctx.body = category.getInfo();
  },

  async deleteCategory(ctx) {
    const { body } = ctx.request;
    await CategoryDB.deleteCategory(body.categoryId);
    ctx.status = 204;
  },
};

module.exports = { controllers };

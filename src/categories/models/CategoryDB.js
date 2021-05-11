const db = require('../../db/db');
const Category = require('./Category');

class CategoryDB {
  static async getCategoryById(id) {
    const categoryResponse = await db.query(`SELECT * FROM "categories" WHERE id = ${id}`);

    if (!categoryResponse.rowCount) {
      throw new Error(`Category with id: ${id}, does not exist`);
    }

    return new Category(categoryResponse.rows[0]);
  }

  static async getCategories() {
    const categoriesResponse = await db.query('SELECT * FROM "categories"');
    const categories = categoriesResponse.rows.map((category) => new Category(category).getInfo());
    return categories;
  }

  static async saveCategory(body) {
    const saveCategoryResponse = await db
      .query(`INSERT INTO "categories" (name) VALUES ('${body.name}') RETURNING *`)
      .catch((err) => {
        if (err.constraint === 'category_name') {
          throw new Error(`Category with the ${body.name} name already exists`);
        }
        throw new Error(err.message);
      });

    return new Category(saveCategoryResponse.rows[0]);
  }

  static async deleteCategory(id) {
    const categoryResponse = await db.query(`DELETE FROM categories WHERE id = ${id}`);

    if (!categoryResponse.rowCount) {
      throw new Error(`Category with id: ${id}, does not exist`);
    }

    return 'deleted';
  }
}

module.exports = { CategoryDB };

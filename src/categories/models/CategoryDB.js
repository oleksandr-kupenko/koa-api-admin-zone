const db = require('../../db/db');

class CategoryDB {
  static async getCategoryById(id) {
    const categoryResponse = await db.query(`SELECT * FROM "categories" WHERE id = ${id}`);

    if (!categoryResponse.rowCount) {
      throw new Error(`Category with id: ${id}, does not exist`);
    }

    const category = categoryResponse.rows[0];
    return category;
  }

  static async getCategories() {
    const categoriesResponse = await db.query(`SELECT * FROM "categories"`);
    const categories = categoriesResponse.rows;
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

    const newCategory = saveCategoryResponse.rows[0];
    return newCategory;
  }

  static async deleteCategory(id) {
    const categoryResponse = await db.query(`DELETE FROM categories WHERE id = ${id}`);

    if (!categoryResponse.rowCount) {
      throw new Error(`Category with id: ${id}, does not exist`);
    }

    return 'deleted';
  }

  static async getUsersFromCategoryById(id) {
    const categoryResponse = await db.query(
      `SELECT u.fname, u.lname, u.email, u.country, u."isRequested", c.name, u.id
      FROM "users" u
      JOIN categories c
      ON c."id" = ${id}
      GROUP BY u.fname, u.lname, u.country, u."isRequested", c.name, u.email, u.id`
    );

    if (!categoryResponse.rowCount) {
      throw new Error(`Category with id: ${id}, does not exist`);
    }

    const users = categoryResponse.rows;
    return users;
  }

  static async getUsersFromCategoryByName(name) {
    const categoryResponse = await db.query(
      `SELECT u.fname, u.lname, u.email, u.country, u."isRequested", c.name, u.id
      FROM "users" u
      JOIN categories c
      ON c.name LIKE '${name}'
      GROUP BY u.fname, u.lname, u.country, u."isRequested", c.name, u.email, u.id`
    );

    if (!categoryResponse.rowCount) {
      throw new Error(`Category with id: ${name}, does not exist`);
    }

    const users = categoryResponse.rows;
    return users;
  }
}

module.exports = { CategoryDB };

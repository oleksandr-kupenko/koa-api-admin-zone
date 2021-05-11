class Category {
  constructor(category) {
    this._id = category.id;
    this._name = category.name;
  }

  getInfo() {
    return {
      id: this._id,
      name: this._name,
    };
  }

  getId() {
    return this._id;
  }

  getName() {
    return this._name;
  }
}

module.exports = Category;

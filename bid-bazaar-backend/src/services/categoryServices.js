const SQLModel = require("../util/sqlModel");

class Category extends SQLModel {
  constructor() {
    super("Category");
  }
}

module.exports = { Category: new Category() };

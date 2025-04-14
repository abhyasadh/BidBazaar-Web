const SQLModel = require("../util/sqlModel.js");

class ProductSpecifications extends SQLModel {
  constructor() {
    super("ProductSpecifications");
  }
}

module.exports = {
  ProductSpecifications: new ProductSpecifications(),
};

const SQLModel = require("../util/sqlModel.js");

class Images extends SQLModel {
  constructor() {
    super("Images");
  }
}

module.exports = {
  Images: new Images(),
};

const SQLModel = require("../util/sqlModel");

class User extends SQLModel {
  constructor() {
    super("User");
  }
}

module.exports = { User: new User() };

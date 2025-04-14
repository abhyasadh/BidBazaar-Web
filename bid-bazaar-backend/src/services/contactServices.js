const SQLModel = require('../util/sqlModel.js');

class Contact extends SQLModel {
    constructor() {
        super('Contact');
    }
}

module.exports = {
    Contact: new Contact(),
};
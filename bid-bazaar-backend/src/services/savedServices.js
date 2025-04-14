const SQLModel = require('../util/sqlModel.js');

class Saved extends SQLModel {
    constructor() {
        super('Saved');
    }
}

module.exports = {
    Saved: new Saved(),
};
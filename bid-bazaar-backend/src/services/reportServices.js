const SQLModel = require('../util/sqlModel.js');

class Reports extends SQLModel {
    constructor() {
        super('Reports');
    }
}

module.exports = {
    Reports: new Reports(),
};
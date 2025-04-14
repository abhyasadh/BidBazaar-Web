const SQLModel = require('../util/sqlModel.js');

class OTP extends SQLModel {
    constructor() {
        super('OTP');
    }
}

module.exports = {
    OTP: new OTP(),
};
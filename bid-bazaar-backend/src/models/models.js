const SQLModel = require('./sqlModel.js');

class User extends SQLModel {
    constructor() {
        super('User');
    }
}

class Product extends SQLModel {
    constructor() {
        super('Product');
    }
}

class Category extends SQLModel {
    constructor() {
        super('Category');
    }
}

class Images extends SQLModel {
    constructor() {
        super('Images');
    }
}

class Bids extends SQLModel {
    constructor() {
        super('Bids');
    }
}

class Specifications extends SQLModel {
    constructor() {
        super('Specifications');
    }
}

class ProductSpecifications extends SQLModel {
    constructor() {
        super('ProductSpecifications');
    }
}

class Contact extends SQLModel {
    constructor() {
        super('Contact');
    }
}

class Reports extends SQLModel {
    constructor() {
        super('Reports');
    }
}

class Saved extends SQLModel {
    constructor() {
        super('Saved');
    }
}

class OTP extends SQLModel {
    constructor() {
        super('OTP');
    }
}

module.exports = {
    User: new User(),
    Product: new Product(),
    Category: new Category(),
    Images: new Images(),
    Bids: new Bids(),
    Specifications: new Specifications(),
    ProductSpecifications: new ProductSpecifications(),
    Contact: new Contact(),
    Reports: new Reports(),
    Saved: new Saved(),
    OTP: new OTP(),
};

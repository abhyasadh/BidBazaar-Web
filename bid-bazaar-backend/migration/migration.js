const db = require('../src/database/database.js');

const queries = [
    `CREATE TABLE user (
        id int NOT NULL AUTO_INCREMENT,
        firstName varchar(255) NOT NULL,
        lastName varchar(255) NOT NULL,
        profileImageURL varchar(255) DEFAULT NULL,
        email varchar(255) NOT NULL,
        phone varchar(255) NOT NULL,
        password varchar(255) NOT NULL,
        citizenshipImageURL varchar(255) DEFAULT NULL,
        verified tinyint(1) DEFAULT '0',
        failedLoginAttempts int DEFAULT '0',
        accountLockedUntil timestamp NULL DEFAULT NULL,
        isAdmin tinyint(1) DEFAULT '0',
        createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY email (email),
        UNIQUE KEY phone (phone)
    );`,
    `CREATE TABLE category (
        id int NOT NULL AUTO_INCREMENT,
        name varchar(255) NOT NULL,
        image varchar (255) NOT NULL,
        color varchar(255) NOT NULL,
        createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    );`,
    `CREATE TABLE product (
        id int NOT NULL AUTO_INCREMENT,
        userID int DEFAULT NULL,
        categoryID int DEFAULT NULL,
        name varchar(255) NOT NULL,
        description varchar(255) NOT NULL,
        condition varchar(255) NOT NULL,
        price int NOT NULL,
        raise int NOT NULL,
        views int DEFAULT '0',
        createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (userID) REFERENCES user (id) ON DELETE CASCADE,
        FOREIGN KEY (categoryID) REFERENCES category (id)
    );`,
    `CREATE TABLE specifications (
        id int NOT NULL AUTO_INCREMENT,
        categoryID int DEFAULT NULL,
        name varchar(255) NOT NULL,
        hintText varchar(255),
        type enum('text', 'number', 'dropdown') DEFAULT 'text' NOT NULL,
        required tinyint(1) DEFAULT '0',
        createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (categoryID) REFERENCES category (id) ON DELETE CASCADE
    );`,
    `CREATE TABLE options (
        id int NOT NULL AUTO_INCREMENT,
        specificationID int NOT NULL,
        name varchar(255) NOT NULL,
        createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (specificationID) REFERENCES specifications (id) ON DELETE CASCADE
    );`,
    `CREATE TABLE bids (
        id int NOT NULL AUTO_INCREMENT,
        userID int DEFAULT NULL,
        productID int DEFAULT NULL,
        price int NOT NULL,
        createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (userID) REFERENCES user (id) ON DELETE CASCADE,
        FOREIGN KEY (productID) REFERENCES product (id) ON DELETE CASCADE
    );`,
    `CREATE TABLE images (
        id int NOT NULL AUTO_INCREMENT,
        productID int NOT NULL,
        imageURL varchar(255) NOT NULL,
        createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (productID) REFERENCES product (id) ON DELETE CASCADE
    );`,
    `CREATE TABLE product_specifications (
        id int NOT NULL AUTO_INCREMENT,
        productID int NOT NULL,
        specificationID int NOT NULL,
        createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (productID) REFERENCES product (id) ON DELETE CASCADE,
        FOREIGN KEY (specificationID) REFERENCES specifications (id) ON DELETE CASCADE
    );`,
    `CREATE TABLE saved (
        userID int NOT NULL,
        productID int NOT NULL,
        createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (userID, productID),
        FOREIGN KEY (productID) REFERENCES product (id) ON DELETE CASCADE,
        FOREIGN KEY (userID) REFERENCES user (id) ON DELETE CASCADE
    );`,
    `CREATE TABLE contact (
        id int NOT NULL AUTO_INCREMENT,
        userID int NOT NULL,
        subject varchar(255) NOT NULL,
        message varchar(255) NOT NULL,
        createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY userID (userID),
        CONSTRAINT report_ibfk_1 FOREIGN KEY (userID) REFERENCES user (id) ON DELETE CASCADE
    );`
    `CREATE TABLE reports (
        id int NOT NULL AUTO_INCREMENT,
        userID int NOT NULL,
        productID int NOT NULL,
        subject varchar(255) NOT NULL,
        message varchar(255) NOT NULL,
        createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (productID) REFERENCES product (id) ON DELETE CASCADE,
        FOREIGN KEY (userID) REFERENCES user (id) ON DELETE CASCADE
    );`,
    `CREATE TABLE rateLimits (
        id int NOT NULL AUTO_INCREMENT,
        ipAddress varchar(45) NOT NULL,
        requestCount int NOT NULL DEFAULT '1',
        windowStart timestamp NOT NULL,
        updatedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY (ipAddress)
    );`,
    `CREATE TABLE otp (
        id int NOT NULL AUTO_INCREMENT,
        phone varchar(255) NOT NULL UNIQUE,
        otp varchar(255) NOT NULL,
        createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    ) ENGINE=MEMORY;`,
     `INSERT INTO category (name, color, image) VALUES
        ('All', '#ff6c52', 'https://res.cloudinary.com/dprvuiiat/image/upload/v1741882615/Categories/all_npujcj.png'),
        ('Electronics', '#ff6c52', 'https://res.cloudinary.com/dprvuiiat/image/upload/v1741882615/Categories/electronics_u0uidu.png'),
        ('Fashion', '#e29182', 'https://res.cloudinary.com/dprvuiiat/image/upload/v1741882616/Categories/dress_c0ugwt.png'),
        ('Drinks', '#4a94cc', 'https://res.cloudinary.com/dprvuiiat/image/upload/v1741882615/Categories/alcohol_42n9tj.png'),
        ('Furniture', '#bb844c', 'https://res.cloudinary.com/dprvuiiat/image/upload/v1741882615/Categories/furniture_vlxytj.png'),
        ('Real Estate', '#ef7582', 'https://res.cloudinary.com/dprvuiiat/image/upload/v1741882616/Categories/real_estate_dfhvtx.png'),
        ('Sculptures', '#f9e3aa', 'https://res.cloudinary.com/dprvuiiat/image/upload/v1741882617/Categories/sculpture_ofqbmv.png'),
        ('Drinks', '#4a94cc', 'https://res.cloudinary.com/dprvuiiat/image/upload/v1741882615/Categories/drinks_jsdfhx.png'),
        ('Antiques', '#f7d291', 'https://res.cloudinary.com/dprvuiiat/image/upload/v1741882616/Categories/antique_jfhg56.png'),
        ('Jewelry', '#ef7582', 'https://res.cloudinary.com/dprvuiiat/image/upload/v1741882616/Categories/jewelry_rtmk9m.png'),
        ('Real Estate', '#ef7582', 'https://res.cloudinary.com/dprvuiiat/image/upload/v1741882616/Categories/realestate_xcfghu.png'),
        ('Sculptures', '#4a94cc', 'https://res.cloudinary.com/dprvuiiat/image/upload/v1741882616/Categories/sculpture_xyhtwl.png'),
        ('Decor', '#f7a400', 'https://res.cloudinary.com/dprvuiiat/image/upload/v1741882615/Categories/decor_xtubvh.png'),
        ('Antiques', '#c46200', 'https://res.cloudinary.com/dprvuiiat/image/upload/v1741882615/Categories/antiques_oplfys.png'),
        ('Watches', '#fdab88', 'https://res.cloudinary.com/dprvuiiat/image/upload/v1741882616/Categories/watch_fdlfro.png'),
        ('Books', '#ffb6c1', 'https://res.cloudinary.com/dprvuiiat/image/upload/v1741882615/Categories/books_qwerty.png');
    `,
    `INSERT INTO specifications (categoryID, name, hintText, required, type) VALUES
        (2, 'Brand', 'Apple', true, 'text'),
        (2, 'Model', 'iPhone 16 Pro', true, 'text'),
        (2, 'Manufactured Year', '2024', false, 'number'),
        (2, 'Warranty Available', 'Yes', false, 'text'),
        (3, 'Brand', 'Hyundai', true, 'text'),
        (3, 'Model', 'Creta', true, 'text'),
        (3, 'Manufactured Year', '2020', true, 'number'),
        (3, 'Odometer (KM)', '60,000', true, 'number'),
        (3, 'Fuel Type', 'Petrol', true, 'dropdown'),
        (3, 'Transmission', 'Manual', true, 'dropdown'),
        (4, 'Purchased From', 'Dev Corner', true, 'text'),
        (4, 'Material', 'Gold', true, 'text'),
        (4, 'Weight', '15 tola', true, 'text'),
        (4, 'Gemstone', 'Diamond', false, 'text'),
        (5, 'Location', 'Kathmandu', true, 'text'),
        (5, 'Property Type', 'House', true, 'dropdown'),
        (5, 'Size', '8 Aana', true, 'text'),
        (5, 'Bedrooms', '3', false, 'number'),
        (5, 'Bathrooms', '2', false, 'number'),
        (5, 'Year Built', '2005', false, 'number'),
        (5, 'Additional Amenities', 'Swimming Pool, Gym', false, 'text'),
        (6, 'Brand', 'Ikea', false, 'text'),
        (6, 'Material', 'Wood', true, 'text'),
        (6, 'Dimensions', '200cm x 150cm x 75cm', false, 'text'),
        (7, 'Brand', 'Gucci', true, 'text'),
        (7, 'Size', 'M', true, 'dropdown'),
        (7, 'Material', 'Cotton', true, 'text'),
        (8, 'Age (Years)', '100', true, 'number'),
        (8, 'Origin', 'France', false, 'text'),
        (10, 'Artist', 'Auguste Rodin', false, 'text'),
        (10, 'Material', 'Bronze', true, 'text'),
        (10, 'Dimensions', '50cm x 30cm x 20cm', true, 'text'),
        (11, 'Material', 'Ceramic', true, 'text'),
        (12, 'Brand', 'Jack Daniels', true, 'text'),
        (12, 'Type', 'Whiskey', true, 'text'),
        (12, 'Volume (ml)', '750', true, 'number'),
        (12, 'Age (Years)', '30', true, 'number'),
        (12, 'Alcohol %', '40', true, 'number'),
        (13, 'Title', 'Mona Lisa', true, 'text'), 
        (13, 'Artist', 'Leonardo da Vinci', true, 'text'), 
        (13, 'Year', '1503', false, 'number'),
        (13, 'Medium', 'Oil on Wood Panel', true, 'text'),
        (13, 'Dimensions', '73.7 cm x 92.1 cm', true, 'text');`,

    `INSERT into options (specificationID, name) VALUES 
        (9, 'Petrol'), 
        (9, 'Diesel'),
        (9, 'Electric'),
        (9, 'Hybrid'),
        (10, 'Manual'),
        (10, 'Automatic'),
        (16, 'House'),
        (16, 'Apartment'),
        (16, 'Land'),
        (16, 'Commercial'),
        (26, 'XXS'),
        (26, 'XS'),
        (26, 'S'),
        (26, 'M'),
        (26, 'L'),
        (26, 'XL'),
        (26, 'XXL');`
];

async function executeQueries() {
    for (const query of queries) {
        try {
            await db.query(query);
            console.log('Table created successfully.');
        } catch (error) {
            console.error('Error creating table:', error);
        }
    }
}

executeQueries();
const SQLModel = require("../util/sqlModel.js");
const { Bids } = require("./bidServices.js");

class Product extends SQLModel {
  constructor() {
    super("Product");
  }

  async getProducts(all, id) {
    const rows = await this.query(
      `SELECT 
            product.id AS productId,
            product.name,
            product.price as initPrice,
            product.createdAt,
            (SELECT imageURL FROM images WHERE images.productId = product.id LIMIT 1) AS imageURL,
            bidStats.bidCount,
            highestBid.price AS highestBid,
            highestBid.updatedAt AS highestBidUpdatedAt
        FROM product
        LEFT JOIN (
            SELECT productId, COUNT(id) AS bidCount
            FROM bids
            GROUP BY productId
        ) AS bidStats ON product.id = bidStats.productId
        LEFT JOIN (
            SELECT b1.productId, b1.price, b1.updatedAt
            FROM bids b1
            INNER JOIN (
                SELECT productId, MAX(price) AS maxPrice
                FROM bids
                GROUP BY productId
            ) b2 ON b1.productId = b2.productId AND b1.price = b2.maxPrice
        ) AS highestBid ON product.id = highestBid.productId
        WHERE product.userId ${
          all
            ? "!= ? AND (highestBid.updatedAt IS NULL AND product.createdAt >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 24 HOUR)) OR (highestBid.updatedAt >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 HOUR));"
            : "= ?;"
        }`,
      [id]
    );

    const products = rows.map((row) => ({
      id: row.productId,
      name: row.name,
      price: row.initPrice,
      createdAt: row.createdAt,
      image: row.imageURL,
      bidCount: row.bidCount,
      highestBid: row.highestBid,
      highestBidUpdatedAt: row.highestBidUpdatedAt,
    }));

    return products;
  }

  async getProductById(id) {
    const [product] = await this.query(
      `SELECT 
              p.id AS productId,
              p.name,
              p.description,
              p.price AS initPrice,
              p.condition,
              p.views,
              p.raise,
              p.createdAt,
  
              u.firstName,
              u.lastName,
              u.profileImageUrl,
              u.phone,
              u.verified,
  
              COALESCE(img.imageURLs, '[]') AS images,
              COALESCE(specs.specifications, '{}') AS specifications
  
          FROM product p
  
          LEFT JOIN user u ON p.userId = u.id
  
          LEFT JOIN (
              SELECT productId, JSON_ARRAYAGG(imageURL) AS imageURLs
              FROM images
              GROUP BY productId
          ) AS img ON p.id = img.productId
  
          LEFT JOIN (
              SELECT 
                  s.categoryId, 
                  ps.productId, 
                  JSON_OBJECTAGG(s.name, COALESCE(ps.value, 'N/A')) AS specifications
              FROM specifications s
              LEFT JOIN productSpecifications ps 
                  ON s.id = ps.specificationId
              GROUP BY ps.productId, s.categoryId
          ) AS specs ON p.id = specs.productId AND p.categoryId = specs.categoryId
  
          WHERE p.id = ?`,
      [id]
    );

    if (!product) {
      throw new Error("Product not found!");
    }

    const bids = await Bids.getBidsList(product.productId);

    const finalProduct = {
      id: product.productId,
      name: product.name,
      description: product.description,
      price: product.initPrice,
      condition: product.condition,
      views: product.views,
      raise: product.raise,
      images: JSON.parse(product.images),
      createdAt: product.createdAt,
      user: {
        firstName: product.firstName,
        lastName: product.lastName,
        profileImageUrl: product.profileImageUrl + "?v=" + Date.now(),
        phone: product.phone,
        verified: product.verified,
      },
      specifications: JSON.parse(product.specifications),
      bids,
    };

    return finalProduct;
  }

  async updateViewCount(id) {
    await this.query(
      `
          UPDATE product 
          SET views = views + 1 
          WHERE id = ?
        `,
      [id]
    );
  }

  async filterProducts(categories, price, endsIn, sortBy, lowToHigh) {
    let query = `
        SELECT 
            product.id AS productId,
            product.name,
            COALESCE(highestBid.price, product.price) AS effectivePrice, 
            product.createdAt,
            (SELECT imageURL FROM images WHERE images.productId = product.id LIMIT 1) AS imageURL,
            bidStats.bidCount,
            highestBid.price AS highestBid,
            highestBid.updatedAt AS highestBidUpdatedAt,
            category.name AS categoryName,
    
            CASE 
                WHEN highestBid.updatedAt IS NOT NULL 
                THEN TIMESTAMPDIFF(MINUTE, NOW(), DATE_ADD(highestBid.updatedAt, INTERVAL 6 HOUR))
                ELSE TIMESTAMPDIFF(MINUTE, NOW(), DATE_ADD(product.createdAt, INTERVAL 24 HOUR))
            END AS remainingTime
    
        FROM product
        LEFT JOIN category ON product.categoryId = category.id
        LEFT JOIN (
            SELECT productId, COUNT(id) AS bidCount
            FROM bids
            GROUP BY productId
        ) AS bidStats ON product.id = bidStats.productId
        LEFT JOIN (
            SELECT b1.productId, b1.price, b1.updatedAt
            FROM bids b1
            WHERE b1.price = (
                SELECT MAX(b2.price) 
                FROM bids b2 
                WHERE b2.productId = b1.productId
            )
            LIMIT 1
        ) AS highestBid ON product.id = highestBid.productId
        HAVING remainingTime > 0`;

    const queryParams = [];

    if (!categories.includes("All") && categories.length > 0) {
      query += ` AND category.name IN (?)`;
      queryParams.push(categories);
    }

    if (price.min) {
      query += ` AND COALESCE(highestBid.price, product.price) >= ?`;
      queryParams.push(price.min);
    }
    if (price.max) {
      query += ` AND COALESCE(highestBid.price, product.price) <= ?`;
      queryParams.push(price.max);
    }

    if (endsIn.min >= 0) {
      query += ` AND (GREATEST(0,
            CASE 
                WHEN highestBid.updatedAt IS NOT NULL 
                THEN TIMESTAMPDIFF(MINUTE, NOW(), DATE_ADD(highestBid.updatedAt, INTERVAL 6 HOUR))
                ELSE TIMESTAMPDIFF(MINUTE, NOW(), DATE_ADD(product.createdAt, INTERVAL 24 HOUR))
            END) >= ?
        )`;
      queryParams.push(endsIn.min * 60);
    }
    if (endsIn.max <= 24) {
      query += ` AND (GREATEST(0,
            CASE 
                WHEN highestBid.updatedAt IS NOT NULL 
                THEN TIMESTAMPDIFF(MINUTE, NOW(), DATE_ADD(highestBid.updatedAt, INTERVAL 6 HOUR))
                ELSE TIMESTAMPDIFF(MINUTE, NOW(), DATE_ADD(product.createdAt, INTERVAL 24 HOUR))
            END) <= ?
        )`;
      queryParams.push(endsIn.max * 60);
    }

    if (sortBy !== "None") {
      let orderByColumn = "product.createdAt";
      if (sortBy === "Price") {
        orderByColumn = "effectivePrice";
      } else if (sortBy === "Bids Placed") {
        orderByColumn = "bidStats.bidCount";
      } else if (sortBy === "Time Left") {
        orderByColumn = "remainingTime";
      }

      query += ` ORDER BY ${orderByColumn} ${lowToHigh ? "ASC" : "DESC"}`;
    } else {
      query += ` ORDER BY product.createdAt ASC`;
    }

    const rows = await this.query(query, queryParams);
    const products = rows.map((row) => ({
      id: row.productId,
      name: row.name,
      price: row.effectivePrice,
      createdAt: row.createdAt,
      image: row.imageURL,
      bidCount: row.bidCount,
      highestBid: row.highestBid,
      highestBidUpdatedAt: row.highestBidUpdatedAt,
      remainingTime: row.remainingTime,
    }));

    return products;
  }

  async getSaved(userId) {
    const rows = await this.query(
      `SELECT 
            product.id AS productId,
            product.name,
            product.price as initPrice,
            product.createdAt,
            (SELECT imageURL FROM images WHERE images.productId = product.id LIMIT 1) AS imageURL,
            bidStats.bidCount,
            highestBid.price AS highestBid,
            highestBid.updatedAt AS highestBidUpdatedAt
        FROM product
            RIGHT JOIN saved on product.id = saved.productId
        LEFT JOIN (
            SELECT productId, COUNT(id) AS bidCount
            FROM bids
            GROUP BY productId
        ) AS bidStats ON product.id = bidStats.productId
        LEFT JOIN (
            SELECT b1.productId, b1.price, b1.updatedAt
            FROM bids b1
            INNER JOIN (
                SELECT productId, MAX(price) AS maxPrice
                FROM bids
                GROUP BY productId
            ) b2 ON b1.productId = b2.productId AND b1.price = b2.maxPrice
        ) AS highestBid ON product.id = highestBid.productId
        WHERE saved.userId = ? AND (
            highestBid.updatedAt IS NULL AND product.createdAt >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 24 HOUR)
        ) OR (
            highestBid.updatedAt >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 HOUR)
        );`,
      [userId]
    );

    const products = rows.map((row) => ({
      id: row.productId,
      name: row.name,
      price: row.initPrice,
      createdAt: row.createdAt,
      image: row.imageURL,
      bidCount: row.bidCount,
      highestBid: row.highestBid,
      highestBidUpdatedAt: row.highestBidUpdatedAt,
    }));

    return products;
  }
}

module.exports = { Product: new Product() };

const SQLModel = require("../util/sqlModel");

class Bids extends SQLModel {
  constructor() {
    super("Bids");
  }

  async verifyPrice(productId, price) {
    let verified = true;

    const [result] = await this.query(
      "SELECT product.id, product.price AS originalPrice, product.raise, MAX(bids.price) AS highestPrice FROM product LEFT JOIN bids ON product.id = bids.productID WHERE product.id = ? GROUP BY product.id;",
      [productId]
    );

    if (!result) {
      verified = false;
    }

    if (
      price <
      Math.max(
        result.originalPrice + result.raise,
        (result.highestPrice || 0) + result.raise
      )
    ) {
      verified = false;
    }

    return verified;
  }

  async getBidsList(productId) {
    return await this.query(
      `SELECT 
            b.price, b.createdAt,
            u.id, u.firstName, u.lastName
        FROM bids b
        LEFT JOIN user u ON b.userId = u.id
        WHERE b.productId = ?
        ORDER BY b.price DESC`,
      [productId]
    );
  }
}

module.exports = { Bids: new Bids() };

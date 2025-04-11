const { Bids, Product } = require("../models/models");
const { getIo, userSocketMap } = require("../socket/socket");

const newBid = async (req, res) => {
  const { productId, price } = req.body;
  const user = req.session.user.id;

  if (!user) {
    return res.status(401).json({ error: "Unauthorized!" });
  }

  if (!productId || !price) {
    return res.json({
      success: false,
      message: "Please enter all fields!",
    });
  }

  try {
    const [result] = await Product.query(
      "SELECT product.id, product.price AS originalPrice, product.raise, MAX(bids.price) AS highestPrice FROM product LEFT JOIN bids ON product.id = bids.productID WHERE product.id = ? GROUP BY product.id;",
      [productId]
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    if (
      price <
      Math.max(
        result.originalPrice + result.raise,
        (result.highestPrice || 0) + result.raise
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Price must me greater than current highest price!",
      });
    }

    await Bids.insert({ userId: user, productId: productId, price: price });

    const bids = await Bids.query(
      `SELECT 
            b.price, b.createdAt,
            u.id, u.firstName, u.lastName
         FROM bids b
         LEFT JOIN user u ON b.userId = u.id
         WHERE b.productId = ?
         ORDER BY b.price DESC`,
      [productId]
    );

    const io = getIo();
    
    io.to(String(productId)).emit("bid-update", {
        productId,
        bids,
    });

    res.status(200).json({
      success: true,
      message: "Bid placed successfully!",
      bids: bids,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

module.exports = { newBid };

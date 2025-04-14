const { Bids } = require("../services/bidServices");
const { getIo } = require("../socket/socket");

const newBid = async (req, res) => {
  const { productId, price } = req.body;
  const user = req.session.user.id;

  if (!productId || !price) {
    return res.json({
      success: false,
      message: "Please enter all fields!",
    });
  }

  try {
    const verification = await Bids.verifyPrice(productId, price);
    if (!verification){
      return res.json({
        success: false,
        message: "Invalid price!"
      })
    }

    await Bids.insert({ userId: user, productId: productId, price: price });
  
    const bids = await Bids.getBidsList(productId);

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

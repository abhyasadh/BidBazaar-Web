const express = require("express");
const router = express.Router();
const product = require("../controllers/productController");
const filter = require("../util/methodFilter");

router.route("/new").post(product.productPost).all(filter.methodNotAllowed);

router.route("/all").get(product.getProducts).all(filter.methodNotAllowed);

router.route("/own").get(product.getProducts).all(filter.methodNotAllowed);

router
  .route("/get/:productId")
  .get(product.getProductById)
  .all(filter.methodNotAllowed);

router
  .route("/filter")
  .post(product.filterProducts)
  .all(filter.methodNotAllowed);

router
  .route("/save")
  .post(product.save)
  .all(filter.methodNotAllowed);

router
  .route("/get-saved")
  .get(product.getSaved)
  .all(filter.methodNotAllowed);

module.exports = router;

const express = require("express");
const router = express.Router();
const product = require("../controllers/productController");
const filter = require("../util/methodFilter");
const { requiresUser } = require("../util/requiresUser");

router
  .route("/new", requiresUser)
  .post(product.productPost)
  .all(filter.methodNotAllowed);

router
  .route("/all", requiresUser)
  .get(product.getProducts)
  .all(filter.methodNotAllowed);

router
  .route("/own", requiresUser)
  .get(product.getProducts)
  .all(filter.methodNotAllowed);

router
  .route("/get/:productId", requiresUser)
  .get(product.getProductById)
  .all(filter.methodNotAllowed);

router
  .route("/filter", requiresUser)
  .post(product.filterProducts)
  .all(filter.methodNotAllowed);

router
  .route("/save", requiresUser)
  .post(product.save)
  .all(filter.methodNotAllowed);

router
  .route("/get-saved", requiresUser)
  .get(product.getSaved)
  .all(filter.methodNotAllowed);

module.exports = router;

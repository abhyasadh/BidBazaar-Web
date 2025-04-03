const express = require('express');
const router = express.Router();
const category = require("../controllers/categoryController");
const filter = require('../util/methodFilter');

router.route('/')
    .get(category.getCategories)
    .all(filter.methodNotAllowed);

router.route('/specifications/:categoryId')
    .get(category.getSpecifications)
    .all(filter.methodNotAllowed);

module.exports = router;

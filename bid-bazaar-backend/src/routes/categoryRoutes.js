const express = require('express');
const router = express.Router();
const category = require("../controllers/categoryController");
const filter = require('../util/methodFilter');
const { requiresUser } = require('../util/requiresUser');

router.route('/', requiresUser)
    .get(category.getCategories)
    .all(filter.methodNotAllowed);

router.route('/specifications/:categoryId', requiresUser)
    .get(category.getSpecifications)
    .all(filter.methodNotAllowed);

module.exports = router;

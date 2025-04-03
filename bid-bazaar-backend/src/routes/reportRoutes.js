const express = require('express');
const router = express.Router();
const report = require("../controllers/contactController");
const filter = require('../util/methodFilter');

router.route('/')
    .post(report.report)
    .all(filter.methodNotAllowed);

module.exports = router;

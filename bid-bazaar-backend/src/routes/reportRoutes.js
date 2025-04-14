const express = require('express');
const router = express.Router();
const report = require("../controllers/contactController");
const filter = require('../util/methodFilter');
const { requiresUser } = require('../util/requiresUser');

router.route('/', requiresUser)
    .post(report.report)
    .all(filter.methodNotAllowed);

module.exports = router;

const express = require('express');
const router = express.Router();
const bids = require("../controllers/bidController");
const filter = require('../util/methodFilter');
const { requiresUser } = require('../util/requiresUser');

router.route('/', requiresUser)
    .post(bids.newBid)
    .all(filter.methodNotAllowed);

module.exports = router;

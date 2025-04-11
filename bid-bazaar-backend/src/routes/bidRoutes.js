const express = require('express');
const router = express.Router();
const bids = require("../controllers/bidController");
const filter = require('../util/methodFilter');

router.route('/')
    .post(bids.newBid)
    .all(filter.methodNotAllowed);

module.exports = router;

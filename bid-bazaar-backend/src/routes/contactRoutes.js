const express = require('express');
const router = express.Router();
const contact = require("../controllers/contactController");
const filter = require('../util/methodFilter');

router.route('/')
    .post(contact.contact)
    .all(filter.methodNotAllowed);

module.exports = router;

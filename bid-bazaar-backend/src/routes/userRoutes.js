const express = require('express');
const router = express.Router();
const user = require("../controllers/userController");
const filter = require('../util/methodFilter');
const { requiresUser } = require('../util/requiresUser');

router.route('/session')
    .get(user.getSession)
    .all(filter.methodNotAllowed);

router.route('/login')
    .post(user.login)
    .all(filter.methodNotAllowed);

router.route('/register')
    .post(user.register)
    .all(filter.methodNotAllowed);

router.route('/send-otp')
    .post(user.sendOTP)
    .all(filter.methodNotAllowed);

router.route('/verify-otp')
    .post(user.verifyOTP)
    .all(filter.methodNotAllowed);

router.route('/update-password')
    .put(user.updatePassword)
    .all(filter.methodNotAllowed);

router.route('/update', requiresUser)
    .put(user.update)
    .all(filter.methodNotAllowed);

router.route('/logout', requiresUser)
    .post(user.logout)
    .all(filter.methodNotAllowed);

module.exports = router;

const requiresUser = (req, res, next) => {
  if (!req.session.user) {
    return res.json({
      success: false,
      message: "Session Expired. Please Login Again!",
    });
  }
  next();
};

module.exports = {requiresUser};

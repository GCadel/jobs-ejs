const authMiddleware = (req, res, next) => {
  if (!req.user) {
    req.flash("error", "You are not logged in");
    res.redirect("/");
  } else {
    next();
  }
};

module.exports = authMiddleware;

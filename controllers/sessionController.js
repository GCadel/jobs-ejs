const User = require("../models/User");
const parseVErr = require("../utils/parseValidationErr");

const registerShow = (req, res) => {
  res.render("register");
};

const registerDo = async (req, res, next) => {
  if (req.body.password != req.body.confPassword) {
    req.flash("error", "Passwords do not match.");
    return res.render("register", { errors: flash("errors") });
  }

  try {
    await User.create(req.body);
  } catch (error) {
    if (error.constructor.name === "ValidationError") {
      parseVErr(error, req);
    } else if (error.name === "MongoServerError" && error.code === 11000) {
      req.flash("error", "That email is already registered");
    } else {
      return next(e);
    }
    return res.render("register", { errors: flash("errors") });
  }
  res.redirect("/");
};

const logoff = (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
};
const logonShow = (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("logon");
  // res.render("logon", {
  //   errors: req.flash("error"),
  //   info: req.flash("info"),
  // });
};

module.exports = { registerShow, registerDo, logonShow, logoff };

const express = require("express");

const router = express.Router();

const {
  logonShow,
  registerShow,
  registerDo,
  logoff,
} = require("../controllers/sessionController");
const passport = require("passport");

router.route("/register").get(registerShow).post(registerDo);
router
  .route("/logon")
  .get(logonShow)
  .post(
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/sessions/logon",
      failureFlash: true,
    }),
    // (req, res) => {
    //   res.send("N/A");
    // },
  );

router.route("/logoff").post(logoff);

module.exports = router;

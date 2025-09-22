const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const { savedUrl } = require("../middleware.js");
const userController = require("../controller/user.js");
const user = require("../models/user.js");

router.route("/signup")
.get( userController.renderSignupForm)
.post( userController.signup);

router.route("/login")
.get(userController.renderLoginForm)
.post(
  savedUrl,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  userController.login
);
router.get("/logout", userController.logout);

module.exports = router;

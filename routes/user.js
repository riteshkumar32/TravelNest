const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");


const userController = require("../controllers/users.js");


// signup
router.get("/signup",(userController.renderSignupForm));

router.post(
  "/signup",
  (userController.signup));



// Login
router.get("/login",(userController.renderLoginForm));

// Login using passsport as a middleware
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", { 
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (userController.login));
  

// logout
router.get("/logout",(userController.logout));



module.exports = router;

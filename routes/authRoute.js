const express = require("express");
const jwt = require('jsonwebtoken');
const router = express.Router();
const flash = require("connect-flash"); //conncet flash
const authController = require("../controllers/authController"); //import authcontroller
const passport = require("passport");
const {generateToken} = require('../passport-config');
const app = express();
app.use(express.json());    
app.use(express.urlencoded({ extended: false })); 
const cookieParser = require('cookie-parser');
// Flash message middleware
app.use(flash());

router.post("/signup", authController.signup);

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),(req, res) => {
    const token = generateToken(req.user); 
    res.cookie('jwt', token, { httpOnly: true });
    if (req.user.isAdmin) {
      res.redirect("/admin");
    } else {
      res.redirect("/");
    }
  }
);



module.exports = router;

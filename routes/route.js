const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const {verifyToken} = require('../passport-config');
const jwt = require('jsonwebtoken');
const { checkAuthenticated, checkNotAuthenticated,checkAdmin } = require("../middleware/authMiddleware");

// Routes
router.get("/", (req, res) => {
  res.redirect("/membership");
});

router.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("index", { messages: req.flash() });
});

router.get("/signup", checkNotAuthenticated, (req, res) => {
  res.render("signup", { messages: req.flash() });
});

router.get("/contact", verifyToken, (req, res) => {
  res.render("contact");
});

router.get("/admin", checkAdmin,verifyToken,async (req, res, next) => {
  try {
    const users = await userModel.find({});
    res.render("admin/admin", {
      users,
      messages: null,
      user:req.user,
    });
  } catch (error) {
    next(error); 
  }
});
router.get("/admin2", checkAdmin,verifyToken,async (req, res, next) => {
  try {
    const users = await userModel.find({});
    res.render("admin/adminTheater", {
      users,
      messages: null,
      user:req.user,
    });
  } catch (error) {
    next(error); 
  }
});

//view user in json (gk penting)
router.get("/users",verifyToken, checkAdmin, async (req, res, next) => {
  try {
    const users = await userModel.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get("/payment", verifyToken, async (req,res,next) =>{
  res.render("payment");
});


//logout
router.get('/logout', (req, res) => {
  req.logout(() => {
      req.session.destroy(() => {
        res.clearCookie('jwt');
          req.app.locals.isLoggedIn = false; // Set isLoggedIn to false in application locals
          res.redirect('/'); // Redirect to the homepage after logout
      });
  });
});


router.get("/membership", verifyToken,(req, res) => {
    // If authenticated, render the membership page and pass user information to the view
    res.render("membership", { user: req.user });
});


router.get("*", (req, res) => {
  res.redirect("/membership"); // Redirect to the "membership" template
});

module.exports = router;

const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const TheaterData = require("../models/theaterModel"); // Import the userModel
const jwt = require('jsonwebtoken');
const { verifyToken, checkNotAuthenticated,checkAdmin } = require("../middleware/authMiddleware");

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

router.get("/profile", verifyToken, (req, res) => {
  res.render("profile",{user:req.user,messages:null,open:null});
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
    const theaters = await TheaterData.find({});
    res.render("admin/adminTheater", {
      theaters,
      messages: null,
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


router.get("/payment1", verifyToken, async (req,res,next) =>{
  res.render("payment1",{user:req.user});
});

router.get("/payment2", verifyToken, async (req,res,next) =>{
  res.render("payment2",{user:req.user});
});

router.get("/payment3", verifyToken, async (req,res,next) =>{
  res.render("payment3",{user:req.user});
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


router.get("/membership", verifyToken,async(req, res) => {
    // If authenticated, render the membership page and pass user information to the view
    const theaters = await TheaterData.find({});
    res.render("membership", { theaters,user: req.user });
});


router.get("*", (req, res) => {
  res.redirect("/membership"); // Redirect to the "membership" template
});

module.exports = router;

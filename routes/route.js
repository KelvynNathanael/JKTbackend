const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const authController = require("../controllers/authController");
const passport = require("passport");

// Middleware to check if the user is authenticated
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

// Middleware to redirect logged-in users from login and register pages
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/membership");
  }
  next();
}

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

router.get("/admin", checkAuthenticated, async (req, res, next) => {
  try {
    const users = await userModel.find({});
    res.render("admin/admin", { 
      users, 
      messages: req.flash()
    });
  } catch (error) {
    next(error);
  }
});

router.get("/users", checkAuthenticated, async (req, res, next) => {
  try {
    const users = await userModel.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get("/membership", (req, res) => {
  if (req.isAuthenticated()) {
    // If authenticated, render the membership page and pass user information to the view
    res.render("membership", { user: req.user });
  } else {
    // If not authenticated, render the membership page without user information
    res.render("membership", { user: null });
  }
});


router.post("/signup", authController.signup);

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
}));

router.post("/admin/delete", async (req, res, next) => {
  const userId = req.body.userId;
  try {
    await userModel.findByIdAndDelete(userId);
    console.log(`User ${userId.name} deleted`);
    res.redirect("/admin");
  } catch (error) {
    next(error);
  }
});

router.post("/createUser", authController.createUser);
 


// Define a route to handle logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error logging out:', err);
      res.status(500).send('Error logging out');
    } else {
      res.redirect('/login'); // Redirect the user to the login page after logout
    }
  });
});

router.get("*", (req, res) => {
  res.redirect("/membership"); // Redirect to the "membership" template
});

module.exports = router;

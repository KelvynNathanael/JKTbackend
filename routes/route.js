const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const { checkAuthenticated, checkNotAuthenticated } = require("../middleware/authMiddleware");

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

router.get("/admin", async (req, res, next) => {
  try {
    const users = await userModel.find({});
    res.render("admin/admin", {
      users,
      messages: null,
    });
  } catch (error) {
    next(error);
  }
});


//view user in json (gk penting)
router.get("/users", async (req, res, next) => {
  try {
    const users = await userModel.find({}).sort({ isAdmin: 1 });
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

router.get("*", (req, res) => {
  res.redirect("/membership"); // Redirect to the "membership" template
});

module.exports = router;

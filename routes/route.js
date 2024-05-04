const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const TheaterData = require("../models/theaterModel"); // Import the userModel
const jwt = require("jsonwebtoken");
const {
  verifyToken,
  checkNotAuthenticated,
  checkAdmin,
} = require("../middleware/authMiddleware");
const fs = require("fs");
const path = require("path");
const paymentModel = require("../models/paymentModel");

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
  res.render("profile", { user: req.user, messages: null, open: null });
});

router.get("/admin", verifyToken, checkAdmin, async (req, res, next) => {
  try {
    const users = await userModel.find({});
    res.render("admin/admin", {
      users: users,
      messages: null,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/admin2", verifyToken, checkAdmin, async (req, res, next) => {
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
router.get("/admin3", verifyToken, checkAdmin, async (req, res, next) => {
  try {
    const payments = await paymentModel.find({});
    res.render("admin/adminPayment", {
      payments,
      messages: null,
    });
  } catch (error) {
    next(error);
  }
});

//view user in json (gk penting)
router.get("/users", verifyToken, checkAdmin, async (req, res, next) => {
  try {
    const users = await userModel.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get("/payment1", verifyToken, async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    return res.render("payment1", { user: req.user });
  }
  res.redirect("/login")
});

router.get("/payment2", verifyToken, async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    return res.render("payment2", { user: req.user });
  }
  res.redirect("/login")
});

router.get("/payment3", verifyToken, async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    return res.render("payment3", { user: req.user });
  }
  res.redirect("/login")
});

//logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.clearCookie("jwt");
      req.app.locals.isLoggedIn = false; // Set isLoggedIn to false in application locals
      res.redirect("/"); // Redirect to the homepage after logout
    });
  });
});

router.get("/membership", verifyToken, async (req, res) => {
  try {
    // Check if theaters count is 0 then add default theaters
    const theatersCount = await TheaterData.find({}).count();
    if (theatersCount < 1) {
      // Read data from JSON file
      const theatersData = fs.readFileSync(
        path.join(__dirname, "../JKT.theaters.json")
      );
      const theaters = JSON.parse(theatersData);

      // Transform the data to match the mongodb format
      const transformedTheaters = theaters.map((theater) => ({
        ...theater,
        startAt: new Date(theater.startAt.$date), // Convert startAt to Date object
        _id: theater._id.$oid, // Extract ObjectId from _id
      }));
      // Insert theaters into the database
      await TheaterData.insertMany(transformedTheaters);
    }

    // Retrieve theaters from the database
    const theaters = await TheaterData.find({});
    var isPay = null;
    if (req.user) {
      isPay = await paymentModel.find({ name: req.user.name });
    }
    res.render("membership", {
      theaters: theaters,
      user: req.user,
      pay: isPay,
    });
  } catch (error) {
    console.error("Error in /membership route:", error);
    res.status(500).send("Internal server error.");
  }
});

router.get("*", (req, res) => {
  res.redirect("/membership"); // Redirect to the "membership" template
});

module.exports = router;

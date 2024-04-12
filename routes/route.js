const express = require("express");
const userModel = require("../models/userModel"); // Import the userModel
const flash = require("connect-flash"); //connect flash
const app = express();
const authController = require("../controllers/authController"); //import authcontroller
const passport = require("passport");




const router = express.Router();
app.use(flash());

router.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("index", { messages: req.flash() });
});

router.get("/signup", checkNotAuthenticated, (req, res) => {
  res.render("signup", { messages: req.flash() });
});

router.get("/admin", checkAuthenticated, (req, res) => {
  // Only accessible to authenticated users
  userModel
    .find({})
    .then((users) => {
      res.render("admin/admin", { users });
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
      res.status(500).send("Internal Server Error");
    });
});

router.get("/users", checkAuthenticated, async (req, res) => {
  // Only accessible to authenticated users
  userModel
    .find({})
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
      res.status(500).send("Internal Server Error");
    });
});

router.get("/membership", checkAuthenticated, (req, res) => {
  // Only accessible to authenticated users

  res.render("membership");
});

router.get("/", (req, res) => {
  res.redirect("/login");
});

// Middleware function to check if the user is authenticated
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("checkauth success");
    return next(); // If authenticated, continue to the next middleware/route handler
  }

  console.log("checkauth failed");
  res.redirect("/login"); // If not authenticated, redirect to the login page
}

// Middleware function to redirect logged-in users from login and register pages
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("checknotauth failed");
    return res.redirect("/membership"); // Redirect to a different page if logged in
  }
  console.log("checknotauth success");
  next();
}

//login post
router.post("/signup", authController.signup);
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));


//crud post
router.post("/admin/delete", async (req, res) => {
  const userId = req.body.userId;
  try {
    await userModel.findByIdAndDelete(userId);
    console.log(`User ${userId.name} deleted`);
    res.redirect("/admin"); // Redirect back to the admin page after deleting
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

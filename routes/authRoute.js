const express = require("express");
const router = express.Router();
const flash = require("connect-flash"); //conncet flash
const authController = require("../controllers/authController"); //import authcontroller
const passport = require("passport");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middleware/authMiddleware");
const app = express();
app.use(express.json());    
app.use(express.urlencoded({ extended: false })); 
// Flash message middleware
app.use(flash());

router.post("/signup", authController.signup);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// Define a route to handle logout
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error logging out:", err);
      res.status(500).send("Error logging out");
    } else {
      res.redirect("/login"); // Redirect the user to the login page after logout
    }
  });
});
// Define a login route

module.exports = router;

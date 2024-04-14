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
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function(req, res) {
    if (req.user.isAdmin) {
      res.redirect("/admin");
    } else {
      res.redirect("/");
    }
  }
);




module.exports = router;

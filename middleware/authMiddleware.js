// Middleware to check if the user is authenticated
const passport = require("passport");

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  }
  
  // Middleware to redirect logged-in users from login and register pages
  function checkNotAuthenticated(req, res, next) {
    console.log(req.isAuthenticated);
    if (req.isAuthenticated()) {
      return res.redirect("/membership");
    }
    next();
  }
  
  module.exports = { checkAuthenticated, checkNotAuthenticated };
  
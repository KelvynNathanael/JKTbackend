// Middleware to check if the user is authenticated
const passport = require("passport");

function checkAdmin(req, res, next) {
  // Check if the user is authenticated and is an admin
  if (req.isAuthenticated() && req.user.isAdmin) {
    // If the user is authenticated as an admin, allow them to proceed
    return next();
  }
  // If the user is not authenticated as an admin, redirect them to a different page (e.g., the main page or login page)
  res.redirect("/login"); // You can change the redirect location based on your application's logic
}

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
      return res.redirect("/");
    }
    next();
  }
  
  module.exports = { checkAuthenticated, checkNotAuthenticated, checkAdmin};
  
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

function verifyToken(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    return res.render("membership",{user:null})
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        console.log('pls');
        res.clearCookie("jwt");
        return res.redirect("/logout");
      } else {
        // Invalid token, redirect to login
        return res.redirect("/login");
      }
    }

    try {
      const user = await userModel.findById(decoded._id);
      if (!user) {
        // User not found, clear the cookie and redirect to login
        res.clearCookie("jwt");
        return res.redirect("/");
      }
      req.user = user;
      next();
    } catch (error) { 
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });
}
  
  // Middleware to redirect logged-in users from login and register pages
  function checkNotAuthenticated(req, res, next) {
    console.log(req.isAuthenticated);
    if (req.isAuthenticated()) {
      return res.redirect("/");
    }
    next();
  }
  
  module.exports = { verifyToken, checkNotAuthenticated, checkAdmin};
  
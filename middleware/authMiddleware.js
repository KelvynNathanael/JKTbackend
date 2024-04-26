const passport = require("passport");
const userModel = require("../models/userModel"); // Import the userModel
const jwt = require("jsonwebtoken");

function checkAdmin(req, res, next) {
  // Cek jika sudah login dan adalah admin
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  // jika user bukan admin maka akan di arahkan ke login, jika sudah login dan bukan admin akan ke halaman membership
  res.redirect("/login");
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
  
  // Middleware untuk redirect user ke halaman utama jika sudah login
  function checkNotAuthenticated(req, res, next) {
    console.log(req.isAuthenticated);
    if (req.isAuthenticated()) {
      return res.redirect("/");
    }
    next();
  }
  
  module.exports = { verifyToken, checkNotAuthenticated, checkAdmin};
  
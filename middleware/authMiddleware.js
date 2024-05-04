const TheaterData = require("../models/theaterModel"); // Import the userModel
const userModel = require("../models/userModel"); // Import the userModel
const jwt = require("jsonwebtoken");


async function checkAdmin(req, res, next) {
  // Cek jika adalah admin    
  if (req.user.isAdmin) {
    return next();
  }
  // jika user bukan admin maka akan di arahkan ke login, jika sudah login dan bukan admin akan ke halaman membership
  res.redirect("/membership");
}

async function verifyToken(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    const theaters = await TheaterData.find({}); 
    return res.render("membership",{user:null,theaters})
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
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
    const token = req.cookies.jwt;
    if (!token) {
      next();
    }
    return res.redirect("/");
  }
  
  module.exports = { verifyToken, checkNotAuthenticated, checkAdmin};
  
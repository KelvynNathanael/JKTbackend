const passport = require("passport");

function checkAdmin(req, res, next) {
  // Cek jika sudah login dan adalah admin
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  // jika user bukan admin maka akan di arahkan ke login, jika sudah login dan bukan admin akan ke halaman membership
  res.redirect("/login");
}

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  }
  
  // Middleware untuk redirect user ke halaman utama jika sudah login
  function checkNotAuthenticated(req, res, next) {
    console.log(req.isAuthenticated);
    if (req.isAuthenticated()) {
      return res.redirect("/");
    }
    next();
  }
  
  module.exports = { checkAuthenticated, checkNotAuthenticated, checkAdmin};
  
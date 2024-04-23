const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const userModel = require("./models/userModel"); // Import the userModel
const jwt = require("jsonwebtoken");

function generateToken(user) {
  return jwt.sign(user.toObject(), process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h", // session time (1hour)
  });
}

async function initialize(passport, getUserByUsername, getUserById) { 
  const authenticateUser = async (name, password, done) => {
    try {
      const user = await getUserByUsername(name); 
      if (!user) {
        return done(null, false, { message: "Username not found" });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  };

  passport.use(
    new LocalStrategy(
      { usernameField: "name", passwordField: "pwd" },
      authenticateUser
    )
  );

  passport.serializeUser((user, done) => done(null, user.id)); 

  passport.deserializeUser(async (id, done) => { 
    try { 
      const user = await getUserById(id);
      done(null, user); 
    } catch (err) { 
      console.error("Error during user deserialization:", err); 
      done(err); 
    }
  });
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


module.exports = { initialize, generateToken, verifyToken };

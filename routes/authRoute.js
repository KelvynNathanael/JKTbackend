const express  = require('express');
const router   = express.Router();
const { addUser } = require('../controllers/authController'); // Import the addUser function
const userModel = require('../models/userModel'); // Import the userModel
const flash = require('connect-flash');//conncet flash
const authController = require('../controllers/authController'); //import authcontroller
const bcrypt = require('bcrypt'); // Assuming you're using bcrypt for password hashing
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express()
app.use(express.json());    
app.use(express.urlencoded({ extended: false })); 


app.use(passport.initialize());
app.use(passport.session());

// Flash message middleware
app.use(flash())



// Define a login route



module.exports = router;
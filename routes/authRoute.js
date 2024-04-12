const express  = require('express');
const router   = express.Router();
const { addUser } = require('../controllers/authController'); // Import the addUser function
const userModel = require('../models/userModel'); // Import the userModel
const flash = require('connect-flash');//conncet flash
const authController = require('../controllers/authController'); //import authcontroller
const bcrypt = require('bcrypt'); // Assuming you're using bcrypt for password hashing
const passport = require('passport');

const app = express()
app.use(express.json());    
app.use(express.urlencoded({ extended: false })); 

// Flash message middleware
app.use(flash())

router.post('/signup', authController.signup);

router.post('/login',authController.login);


module.exports = router;
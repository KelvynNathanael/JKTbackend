const express  = require('express');
const router   = express.Router();
const { addUser } = require('../controllers/authController'); // Import the addUser function
const userModel = require('../models/userModel'); // Import the userModel
const flash = require('connect-flash');//conncet flash
const authController = require('../controllers/authController'); //import authcontroller
const bcrypt = require('bcrypt'); // Assuming you're using bcrypt for password hashing

const app = express()
app.use(express.json());    
app.use(express.urlencoded({ extended: false })); 

// Flash message middleware
app.use(flash())

router.post('/signup', authController.signup);


router.post('/login', async (req, res) => {
  try {
    const { name, pwd } = req.body;

    const existingUser = await userModel.findOne({ name });

    if (existingUser) {
      const isMatch = bcrypt.compare(pwd, existingUser.password); // Compare hashed passwords

      if (pwd == existingUser.password) {
        console.log("Login success, welcome ", name);
        // ... successful login logic (e.g., create session)
        return res.redirect('/membership');
      } else {
        req.flash('error', 'Invalid username or password');
        console.log("tolol")
        console.log(isMatch)
        console.log(pwd)
        console.log(existingUser.password)
        
        return res.redirect('/login');
      }
    } else {
      req.flash('error', 'Invalid username or password');
      console.log("tolol123")
      return res.redirect('/login');
    }
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).send("Error logging in");
  }
});


  module.exports = router;
const express = require('express');
const userModel = require('../models/userModel'); // Import the userModel
const connection  = require("../utils/db");//import connection?

const app = express()
  
function addUser(data) {
    // Use userModel.create() for data insertion
    return userModel.create(data)
      .then(() => console.log("Saved!"))
      .catch(err => console.error("Error creating user:", err));
}


const { validationResult } = require('express-validator'); // Assuming you're using express-validator for validation

exports.signup = async (req, res) => {
    try {
        const errors = validationResult(req);  // Validate user input (replace with your validation logic)
        if (!errors.isEmpty()) {
            req.flash('error', 'Invalid input and field must be filled');
            return res.redirect('/signup');
        }

        const { name, pwd } = req.body;
        const userData = { name, password:pwd };
        const existingUser = await userModel.findOne({ name });

        if (existingUser || name.length < 1 || pwd.length < 1) {
            req.flash('error', 'Username already exists or fields are empty');
            return res.redirect('/signup');
        }

        console.log("User created:", userData);
        await addUser(userData); 

        res.redirect('/login');
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).send("Error creating user");
    }
};

exports.login = async (req, res) => {
try {
    const { name, pwd } = req.body;

    const existingUser = await userModel.findOne({ name });

    if(!existingUser){
      req.flash('error', 'Invalid username or password');
      console.log("Invalid username or password");
      return res.redirect('/login');
    }
    if(pwd !== existingUser.password){
      req.flash('error', 'Invalid username or password');
      console.log("Invalid username or password");
      return res.redirect('/login');
    }else{
      console.log("Login success, welcome ", name);
        // ... successful login logic (e.g., create session)
        return res.redirect('/membership');
    }
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).send("Error logging in");
  }
};


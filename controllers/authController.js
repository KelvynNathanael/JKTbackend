const express = require("express");
const userModel = require("../models/userModel"); // Import the userModel
const connection = require("../utils/db"); //import connection?
const bcrypt = require("bcrypt");

const app = express();

function addUser(data) {  
  return userModel
    .create(data)
    .then(() => console.log("Saved!"))
    .catch((err) => console.error("Error creating user:", err));
}

const { validationResult } = require("express-validator");

exports.signup = async (req, res) => {
  try {
    const { name, pwd } = req.body;
    const userData = { name, password: pwd };
    const existingUser = await userModel.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    
    
    if (existingUser) {
      req.flash("error", "Username already Taken");
      return res.redirect("/signup");
    }
    if (name.length < 1 || pwd.length < 1) {
      req.flash("error", "username or password must be filled!");
      return res.redirect("/signup");
    }

    if(pwd.length  < 8){
        req.flash('error', 'Password should have at least 8 characters');
        return res.redirect('/signup') ;
    }
       
    const rounds = 10;
    const hashedpassword = await bcrypt.hash(pwd, rounds);
    userData.password = hashedpassword;
    console.log("User created:", userData);
    await addUser(userData);

    res.redirect("/login");
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).send("Error creating user");
  }
};

exports.createUser = async (req, res) => {
  const { name, password, isAdmin } = req.body;

  // Convert the string value of isAdmin to a Boolean
  const isAdminValue = isAdmin === 'on';
  const existingUser = await userModel.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingUser) {
      req.flash("error", "Username already Taken");
      return 
    }
    if (name.length < 1 || password.length < 1) {
      req.flash("error", "username or password must be filled!");
      return
    }
    if(password.length  < 8){
        req.flash('error', 'Password should have at least 8 characters');
        return
    }

  const userData = { name, password, isAdmin: isAdminValue };

  const rounds = 10;
  const hashedpassword = await bcrypt.hash(password, rounds);
  userData.password = hashedpassword;

  return userModel
    .create(userData)
    .then(() => {
      console.log("User created successfully");
      res.redirect("/admin");
    })
    .catch((err) => {
      console.error("Error creating user:", err);
      // Handle error condition, show error message, etc.
    });
};


//not being used
exports.login = async (req, res) => {
  try {
    const { name, pwd } = req.body;

    const existingUser = await userModel.findOne({ name });

    if (!existingUser) {
      req.flash("error", "Username not found");
      console.log("Username not found");
      return res.redirect("/login");
    }

    const isPasswordCorrect = await bcrypt.compare(pwd, existingUser.password);

    if (!isPasswordCorrect) {
      req.flash("error", "Wrong Password");
      console.log("Password is wrong");
      return res.redirect("/login");
    }

    console.log("Login success, welcome ", name);
    return res.redirect("/membership");
    
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).send("Error logging in");
  }
};

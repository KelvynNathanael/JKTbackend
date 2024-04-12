const express = require("express");
const userModel = require("../models/userModel"); // Import the userModel
const bcrypt = require("bcrypt");

function addUser(data) {  
    return userModel
      .create(data)
      .then(() => console.log("Saved!"))
      .catch((err) => console.error("Error creating user:", err));
  }

exports.createUser = async (req, res) => {
    const { name, password, isAdmin } = req.body;
  
    // Convert the string value of isAdmin to a Boolean
    const isAdminValue = isAdmin === 'on';
    const existingUser = await userModel.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
      if (existingUser) {
        req.flash("error", "Username already Taken");
        return res.redirect("/admin"); 
      }
      if (name.length < 1 || password.length < 1) {
        req.flash("error", "username or password must be filled!");
        return res.redirect("/admin");
      }
      if(password.length  < 8){
          req.flash('error', 'Password should have at least 8 characters');
          return res.redirect("/admin");
      }
  
    const userData = { name, password, isAdmin: isAdminValue };
  
    const rounds = 10;
    const hashedpassword = await bcrypt.hash(password, rounds);
    userData.password = hashedpassword;
  
    await addUser(userData);

    res.redirect("admin")
  };
  
const express = require("express");
const userModel = require("../models/userModel"); // Import the userModel

function addUser(data) {  
    return userModel
      .create(data)
      .then(() => console.log("Saved!"))
      .catch((err) => console.error("Error creating user:", err));
  }

//create user via admin 
exports.createUser = async (req, res) => {
    const { name, password, isAdmin } = req.body;
  
    // Convert to a Boolean, bcuz isAdmin is string
    const isAdminValue = isAdmin === 'on';

    const userData = { name, password, isAdmin: isAdminValue };
    await addUser(userData);
    res.redirect("/admin")
  };
//create user via admin 
exports.editUser = async (req, res) => {
    const { id, name, password, isAdmin } = req.body;
    const isAdminValue = isAdmin === 'on';
    
    //test if data was fetched
    console.log(name);
    console.log(password);
    console.log(isAdminValue);  

    const userData = { name, password, isAdmin:isAdminValue };

    try {
      // Update the user data in the database
      await userModel.findByIdAndUpdate(id, userData);
      console.log("User updated successfully!");
      res.redirect("/admin");
    } catch (err) {
      console.error("Error updating user:", err);
      res.status(500).send("Error updating user");
    }
  };
  
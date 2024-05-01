const multer = require("multer");
const path = require("path");
const userModel = require("../models/userModel"); // Import the userModel
const TheaterData = require("../models/theaterModel"); // Import the userModel
const fs = require("fs");

exports.updateUser = async (req, res) => {
  try {
    const { id, name } = req.body;
    console.log(id);
    var User = await userModel.findById(id);
    console.log(User);

    if (!name) {
      res.render("profile", {
        user: User,
        messages: "Please enter your name",
        open:null
      });
      return;
    }
    await userModel.findByIdAndUpdate(id, { name: name });
    User = await userModel.findById(id);
    res.render("profile", { user: User, messages: "Update User Success",open:null });
  } catch (err) {
    console.error(err);
  }
};

exports.changePassword = async (req, res) => {
    const {id} = req.body;
    const User = await userModel.findById(id);
    
    try {
      
    } catch (error) {
      
    }

    res.render('profile',{
        user: User,
        messages: null,
        open : null
    })

};
 
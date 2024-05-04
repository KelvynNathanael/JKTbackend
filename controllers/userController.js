const multer = require("multer");
const path = require("path");
const userModel = require("../models/userModel"); // Import the userModel
const TheaterData = require("../models/theaterModel"); // Import the userModel
const bcrypt = require("bcrypt");
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
        open: null,
      });
      return;
    }
    await userModel.findByIdAndUpdate(id, { name: name });
    User = await userModel.findById(id);
    res.render("profile", {
      user: User,
      messages: "Update User Success",
      open: null,
    });
  } catch (err) {
    console.error(err);
  }
};

exports.changePassword = async (req, res) => {
  const { id, currentPassword, newPassword, confirmPassword } = req.body;
  const User = await userModel.findById(id);

  if (newPassword.length < 8) {
    return res.render("profile", {
      user: User,
      messages: null,
      open: "new password must be at least 8 character!",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(
    currentPassword,
    User.password
  );
  if (!isPasswordCorrect) {
    return res.render("profile", {
      user: User,
      messages: null,
      open: "Password Wrong",
    });
  }

  if (newPassword != confirmPassword) {
    return res.render("profile", {
      user: User,
      messages: null,
      open: "Password Wrong",
    });
  }

  const rounds = 10;
  const hashedpassword = await bcrypt.hash(newPassword, rounds);
  await userModel.findByIdAndUpdate(id, { password: hashedpassword });
  console.log("Password have been changed");
  res.render("profile", {
    user: User,
    messages: "Password Updated",
    open: null,
  });
};

exports.deleteUser = async (req, res) => {
  const userId = req.body.userId;
  try {
    await userModel.findByIdAndDelete(userId);
    console.log(`User ${userId.name} deleted`);
    res.redirect("/membership");
  } catch (error) {
    console.error(error);
  }
};

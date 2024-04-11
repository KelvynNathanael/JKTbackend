const express = require("express");
const userModel = require("../models/userModel");
const connection = require("../utils/db");
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
    const userData = { name: name.toLowerCase(), password: pwd }; // Convert username to lowercase
    const existingUser = await userModel.findOne({ name: userData.name });

    if (existingUser) {
      req.flash("error", "Username already taken");
      return res.redirect("/signup");
    }
    if (name.length < 1 || pwd.length < 1) {
      req.flash("error", "Username or password must be filled!");
      return res.redirect("/signup");
    }

    if (pwd.length < 8) {
      req.flash("error", "Password should have at least 8 characters");
      return res.redirect("/signup");
    }

    const rounds = 10;
    const hashedPassword = await bcrypt.hash(pwd, rounds);
    userData.password = hashedPassword;
    console.log("User created:", userData);
    await addUser(userData);

    res.redirect("/login");
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).send("Error creating user");
  }
};

exports.login = async (req, res) => {
  try {
    const { name, pwd } = req.body;

    const existingUser = await userModel.findOne({ name: name.toLowerCase() }); // Convert username to lowercase

    if (!existingUser) {
      req.flash("error", "Username not found");
      console.log("Username not found");
      return res.redirect("/login");
    }

    const isPasswordCorrect = await bcrypt.compare(pwd, existingUser.password);

    if (!isPasswordCorrect) {
      req.flash("error", "Wrong password");
      console.log("Password is wrong");
      return res.redirect("/login");
    }

    console.log("Login success, welcome ", existingUser.name); // Use existingUser.name after fetching from the database
    // ... successful login logic (e.g., create session)
    return res.redirect("/membership");
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).send("Error logging in");
  }
};

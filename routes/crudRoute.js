const express = require("express");
const userModel = require("../models/userModel"); // Import the userModel
const flash = require("connect-flash"); //connect flash
const app = express();
const authController = require("../controllers/authController");
const crudController = require("../controllers/crudController");

const router = express.Router();

router.post("/admin/delete", async (req, res, next) => {
  const userId = req.body.userId;
  try {
    await userModel.findByIdAndDelete(userId);
    console.log(`User ${userId.name} deleted`);
    res.redirect("/admin");
  } catch (error) {
    next(error);
  }
});

router.post("/createUser", crudController.createUser);

module.exports = router;

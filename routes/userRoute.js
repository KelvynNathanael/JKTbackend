const express = require("express");
const userModel = require("../models/userModel"); // Import the userModel
const theaterData = require("../models/theaterModel"); // Import the userModel
const flash = require("connect-flash"); //connect flash
const app = express();
const userController = require("../controllers/userController");


const router = express.Router();

app.use(express.json());    
app.use(express.urlencoded({ extended: false })); 
app.use(flash());


router.post("/updateUser", userController.updateUser);
router.post("/changePassword", userController.changePassword);
router.post("/deleteuser", userController.deleteUser);

module.exports = router;
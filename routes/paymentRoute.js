const express = require("express");
const userModel = require("../models/userModel"); // Import the userModel
const flash = require("connect-flash"); //connect flash
const app = express();
const paymentController = require("../controllers/paymentController")


const router = express.Router();

app.use(express.json());    
app.use(express.urlencoded({ extended: false })); 
app.use(flash());

router.post("/paying", paymentController.paying);

module.exports = router;
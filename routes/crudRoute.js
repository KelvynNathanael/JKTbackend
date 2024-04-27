const express = require("express");
const multer = require('multer');
const userModel = require("../models/userModel"); // Import the userModel
const theaterData = require("../models/theaterModel"); // Import the userModel
const flash = require("connect-flash"); //connect flash
const app = express();
const authController = require("../controllers/authController");
const upload = multer({ dest: 'uploads/' });
const crudController = require("../controllers/crudController");
const fs = require('fs');
const path = require('path');

const router = express.Router();

app.use(express.json());    
app.use(express.urlencoded({ extended: false })); 
app.use(flash());




//delete by id
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
router.post("/admin/deleteTheater", async (req, res, next) => {
  const theaterId = req.body.theaterId;
  try {
    const theater = await theaterData.findById(theaterId);
    // Delete the image file
    const imagePath = path.join('public', theater.image);
    fs.unlinkSync(imagePath);

    // Delete the theater document
    await theaterData.findByIdAndDelete(theaterId);

    console.log(`Theater ${theater.title} deleted`);
    res.redirect("/admin2");
  } catch (error) {
    next(error);
  }
});


router.post("/createUser", crudController.createUser);//logic in controller

router.post("/editUser",crudController.editUser);

router.post("/createTheater" ,crudController.createTheater);

router.post("/editTheater" ,crudController.editTheater);


module.exports = router;

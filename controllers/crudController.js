const multer = require('multer');
const path = require('path');
const userModel = require("../models/userModel"); // Import the userModel
const TheaterData = require("../models/userModel"); // Import the userModel

function addUser(data) {
  return userModel
    .create(data)
    .then(() => console.log("Saved!"))
    .catch((err) => console.error("Error creating user:", err));
}

function addTheater(data) {
  return TheaterData.create(data)
    .then(() => console.log("Saved!"))
    .catch((err) => console.error("Error creating user:", err));
}

//create user via admin
exports.createUser = async (req, res) => {
  const { name, password, isAdmin } = req.body;

  // Convert to a Boolean, bcuz isAdmin is string
  const isAdminValue = isAdmin === "on";

  const userData = { name, password, isAdmin: isAdminValue };
  await addUser(userData);
  res.redirect("/admin");
};
//create user via admin
exports.editUser = async (req, res) => {
  const { id, name, password, isAdmin } = req.body;
  const isAdminValue = isAdmin === "on";
  const userData = { name, password, isAdmin: isAdminValue };

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

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Folder where files will be stored
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Init Upload
const upload = multer({
  storage: storage,
}).single("file");

exports.createTheater = async (req, res) => {
  const { title, description, startAt, image} = req.body;
  console.log(title);
  console.log(description);
  console.log(startAt);
  console.log(image);
  upload(req, res, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error uploading file");
    } else { 
      console.log('success');
      res.redirect("/admin2");
    }
  });
  

};

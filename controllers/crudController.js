const multer = require("multer");
const path = require("path");
const userModel = require("../models/userModel"); // Import the userModel
const TheaterData = require("../models/theaterModel"); // Import the userModel
const fs = require("fs");

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
//edit user via admin
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
}).single("image");

//create Theater
exports.createTheater = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error uploading file");
    } else {
      // File uploaded successfully
      const { title, description, startAt } = req.body;
      if (!title || !description || !startAt) {
        const theaters = await TheaterData.find({});
        return res.render("admin/adminTheater", {
          theaters,
          messages: "Please fill the form",
        });
      }
      console.log(title);
      console.log(description);
      console.log(startAt);
      console.log(req.file);
      console.log("success");
      const filePath = path.normalize(req.file.path);
      const relativePath = path.relative(path.join("public"), filePath);
      console.log("File uploaded successfully:", relativePath);
      const theaterData = { title, description, startAt, image: relativePath };
      await addTheater(theaterData);
      res.redirect("/admin2");
    }
  });
};

//edit Theater
exports.editTheater = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      const { id, title, description, startAt } = req.body;
      const theater = await TheaterData.findById(id);

      if (!title || !description || !startAt) {
        const theaters = await TheaterData.find({});
        return res.render("admin/adminTheater", {
          theaters,
          messages: "Please fill the form",
        });
      }
      // Delete the image file if input file and input new file
      if (req.file) {
        const imagePath = path.join("public", theater.image);
        fs.unlinkSync(imagePath);
        const filePath = path.normalize(req.file.path);
        const relativePath = path.relative(path.join("public"), filePath);
        console.log("File uploaded successfully:", relativePath);
        const theaterData = {
          title,
          description,
          startAt,
          image: relativePath,
        };
        await TheaterData.findByIdAndUpdate(id, theaterData);
        res.redirect("/admin2");
      }
      //if no file inputted  keep old image
      const theaterData = {
        title,
        description,
        startAt,
        image: theater.image,
      };
      await TheaterData.findByIdAndUpdate(id, theaterData);
      res.redirect("/admin2");
    });
  } catch (err) {
    console.error("Error", err);
    res.status(500).send("Error updating Theater");
  }
};

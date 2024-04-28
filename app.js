const express = require('express');
const mongoose = require('./utils/db')
const path = require('path');
const userModel = require('./models/userModel');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const {initialize} = require('./passport-config');
require("dotenv").config();
const cookieParser = require('cookie-parser');

const port = 6969;
const app = express();

app.use(express.json())//??
app.use(cookieParser());
app.use(express.urlencoded({ extended: false })); //??

app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

initialize( // Menginisialisasi Passport-config.js
  passport, // Objek Passport.js
  async (name) => userModel.findOne({
    name: { $regex: new RegExp(`^${name}$`, "i") },}), 
  async (id) => await userModel.findById(id) 
);

app.set('view engine', 'ejs');  
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Set route
app.use('/', require('./routes/route')); // Page route
app.use('/', require('./routes/crudRoute')); // crud route
app.use('/', require('./routes/authRoute')); // auth route
app.use('/', require('./routes/userRoute')); // user route


app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`);
});


const express = require('express');
const mongoose = require('./utils/db')
const path = require('path');
const userModel = require('./models/userModel');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const initializePassport = require('./passport-config');

const port = 6969;
const app = express();

app.use(express.json())//??
app.use(express.urlencoded({ extended: false })); //??

app.use(session({
  secret: 'Rahasia',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


// Set route
app.use('/', require('./routes/route')); // Page route
app.use('/', require('./routes/crudRoute')); // crud route
app.use('/', require('./routes/authRoute')); // auth route

initializePassport(passport);

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`);
});


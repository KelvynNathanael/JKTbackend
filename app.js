const express = require('express');
const mongoose = require('./utils/db')
const path = require('path');
const userModel = require('./models/userModel');
const flash = require('connect-flash');
const session = require('express-session');

const port = 3000;
const app = express();

app.use(express.json())//??
app.use(express.urlencoded({ extended: false })); //??

app.use(flash());

app.use(session({
  secret: 'Rahasia', // Secret key for session encryption
  resave: false,
  saveUninitialized: true
}));

// view engine tai kucing
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Set route
app.use('/', require('./routes/index')); // Page route
app.use('/', require('./routes/authRoute')); // Auth route
app.use('/', require('./routes/crudRoute')); // Auth route

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});


const express = require('express');
const userModel = require('../models/userModel'); // Import the userModel
const flash = require('connect-flash');//connect flash
const app = express()

const router = express.Router();
app.use(flash())

router.get('/login', (req, res) => {
  res.render('index'); 
});
router.get('/signup', (req, res) => {
  res.render('signup', {messages: req.flash() }); 
});

// JSON data view ()
router.get('/users', async (req, res) => {
    userModel.find({}).then(function(user){
        res.json(user)
      })
});

router.get( '/membership' , ( req , res ) =>{
   res.render( "membership" );
});

router.get( '/' , ( req , res ) =>{
   res.redirect( "/login" );
});


module.exports = router;

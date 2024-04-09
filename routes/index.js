const express = require('express');
const userModel = require('../models/userModel'); // Import the userModel
const flash = require('connect-flash');//connect flash
const app = express()

const router = express.Router();
app.use(flash())

router.get('/login', (req, res) => {
  res.render('index', {messages: req.flash()}); 
});
router.get('/signup', (req, res) => {
  res.render('signup', {messages: req.flash() }); 
});

router.get('/admin', (req, res) => {
  userModel.find({})
      .then(users => {
          res.render('admin/admin', { users });
      })
      .catch(error => {
          console.error('Error fetching users:', error);
          res.status(500).send('Internal Server Error');
      });
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
   res.redirect( "/membership" );
});



module.exports = router;

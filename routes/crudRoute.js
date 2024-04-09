const express = require('express');
const userModel = require('../models/userModel'); // Import the userModel
const flash = require('connect-flash');//connect flash
const app = express()

const router = express.Router();

router.post('/admin/delete', async (req, res) => {
    const userId = req.body.userId;
    try {
      await userModel.findByIdAndDelete(userId);
      console.log(`User ${userId.name} deleted`);
      res.redirect('/admin'); // Redirect back to the admin page after deleting
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).send('Internal Server Error');
    }
  });

module.exports = router;
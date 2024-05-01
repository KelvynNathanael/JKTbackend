const mongoose = require('mongoose');

const UserData = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, default: Date.now },
  
});

const userModel = mongoose.model('users', UserData);

module.exports = userModel;

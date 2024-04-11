const mongoose = require('mongoose');

const UserData = new mongoose.Schema({
  name: { type: String, required: true },
  password:{type :String ,required:true},
  isAdmin:{type :Boolean ,required:true, default:false},
});
const userModel = mongoose.model('users', UserData);

// Export the model for use in other files
module.exports = userModel;


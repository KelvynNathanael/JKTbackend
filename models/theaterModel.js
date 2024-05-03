const mongoose = require('mongoose');

const TheaterData = new mongoose.Schema({
  title: { type: String, required: true},
  description: {type:String, required:true},
  startAt:{type:Date,required:true},
  image:{type:String, required:true},
});

const TheaterModel = mongoose.model('theaters', TheaterData);

module.exports = TheaterModel;

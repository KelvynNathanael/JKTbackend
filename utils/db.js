//database connection
const mongoose = require('mongoose');

const connectionString = 'mongodb://127.0.0.1:27017/JKT'; 

mongoose.connect(connectionString)
.then(() => console.log('Connected to MongoDB!'))
.catch(err => console.error('Error connecting to MongoDB:', err));

module.exports = mongoose;

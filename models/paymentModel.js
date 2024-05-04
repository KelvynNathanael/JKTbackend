const mongoose = require('mongoose');

const paymentData = new mongoose.Schema({
    name: { type: String, required: true, unique: true},
    email: { type: String, required: true },
    number: { type: Number, required: true, default: false },
    price: { type: Number, required: true },
    type: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date}
});

// Create TTL index
paymentData.index({ "expiresAt": 1 }, { expireAfterSeconds: 0 });

const paymentModel = mongoose.model('payments', paymentData);

module.exports = paymentModel;

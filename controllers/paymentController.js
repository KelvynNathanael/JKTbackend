const express = require("express");
const userModel = require("../models/userModel"); // Import the userModel
const connection = require("../utils/db"); //import connection
const paymentModel = require("../models/paymentModel")
const bcrypt = require("bcrypt");

const app = express();

function addPayment(data) {  
    return paymentModel
      .create(data)
      .then(() => console.log("Saved!"))
      .catch((err) => console.error("Error creating user:", err));
  }

exports.paying = async (req, res) => {
    const{type,name,email,number,price,waktu} = req.body;
    if (!type || !name || !email || !number || !price || !waktu) {
        return res.status(400).send("Semua data harus diisi."); // Mengembalikan respons 400 Bad Request jika ada data yang kosong
    }
    const expires = Date.now() + (parseInt(waktu) * 24 * 60 * 60 * 1000); 
    const date = new Date(expires);
    const paymentData = { 
        name: name,
        email: email,
        number: number,
        price: price,
        type: type,
        expiresAt: date
    };

    await addPayment(paymentData);
    
    res.redirect('/payment1');
}
    
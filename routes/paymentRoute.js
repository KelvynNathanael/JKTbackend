
const express = require("express");
const paymentModel = require("../models/paymentModel"); // Import the userModel
const flash = require("connect-flash"); //connect flash
const app = express();
const paymentController = require("../controllers/paymentController")
const router = express.Router();

router.post("/admin/deletePayment", async (req, res, next) => {
    const Paymentsid = req.body.paymentId;
    try {
      await paymentModel.findByIdAndDelete(Paymentsid);
      console.log(`payment ${Paymentsid.name} deleted`);
      res.redirect("/admin3");
    } catch (error) {
      next(error);
    }
  });


app.use(express.json());    
app.use(express.urlencoded({ extended: false })); 
app.use(flash());

router.post("/paying", paymentController.paying);
router.post("/editpayment", paymentController.editPayment);

module.exports = router;
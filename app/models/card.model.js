const mongoose = require("mongoose");

const Card = mongoose.model(
  "Card",
  new mongoose.Schema({
    // id: String,
    userId: String,
    username: String,
    fullname: String,
    email: String,
    country: String,
    address: String,
    contact: String,
    detail: [
        {
            productId: String,
            price: Number,
            amount: Number,
            totalPrice: Number,

        }
    ],
    paymentAddress: String,
    paymentDate: Date,
    paymentType: String,
    status: Number
  })
);

module.exports = Card;

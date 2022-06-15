const mongoose = require("mongoose");

const Order = mongoose.model(
  "Order",
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
            name: String,
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

module.exports = Order;

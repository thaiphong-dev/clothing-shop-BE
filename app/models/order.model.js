const mongoose = require("mongoose");

const Order = mongoose.model(
  "Order",
  new mongoose.Schema({
    // id: String,
    userId: String,
    detail: [
        {
            productId: String,
            price: Number,
            amount: Number,
            totalPrice: Number,

        }
    ],
    orderDate: Date,
    status: Number
  })
);

module.exports = Order;

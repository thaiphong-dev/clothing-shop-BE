const mongoose = require("mongoose");

const Cart = mongoose.model(
  "Cart",
  new mongoose.Schema({
    // id: String,
    userId: String,
    detail: [
        {
            productId: String,
            product: Object,
            name: String,
            size: String,
            price: Number,
            amount: Number,
            totalPrice: Number,
        }
    ],
    cartDate: Date,
    status: Number
  })
);

module.exports = Cart;

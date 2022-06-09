const mongoose = require("mongoose");

const Product = mongoose.model(
  "Product",
  new mongoose.Schema({
    // id: String,
    productname: String,
    price: Number,
    preview: String,
    image: String,
    productType: String,
    gender: Number,
    productInfo: [
        {
          size: String,
          amount: Number,
        },
      ],
    status: Number,
  })
);

module.exports = Product;

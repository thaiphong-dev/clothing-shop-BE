const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    fullname: String,
    username: String,
    email: String,
    password: String,
    role: String,
    country: String,
    address: String,
    contact: String,
    language: String,
    dob: Date,
    sex: String,
    avatar: String,
    status: Number,
  })
);

module.exports = User;

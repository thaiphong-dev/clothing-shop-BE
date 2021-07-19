const mongoose = require('mongoose');

const Menu = mongoose.model(
    "Menu",
    new mongoose.Schema({
        label: String,
        icon: String,
        link: String,
        order: Number,
        roleLevel: Number,
    })
);

module.exports = Menu;

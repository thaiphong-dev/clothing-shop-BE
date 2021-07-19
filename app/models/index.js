const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.contract = require("./contract.model");
db.menu = require("./menu.model");
module.exports = db;

const mongoose = require("mongoose");

const AnnualLeave = mongoose.model(
  "annual-leave",
  new mongoose.Schema({
    fullName: String,
    teamName: String,
    teamLeader: String,
    fromDate: Date,
    toDate: Date,
    type: String,
    status: String,
    reason: String,
    createdDate: Date,
    createdBy: String,
  })
);

module.exports = AnnualLeave;

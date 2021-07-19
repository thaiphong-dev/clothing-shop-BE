const mongoose = require("mongoose");

const AnnualLeave = mongoose.model(
  "AnnualLeave",
  new mongoose.Schema({
    fullName: String,
    teamName: String,
    teamLeader: String,
    fromDate: String,
    toDate: String,
    type: String,
    status: String,
    reason: String,
    createdDate: String,
    createdBy: String,
  })
);

module.exports = AnnualLeave;

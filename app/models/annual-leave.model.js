const mongoose = require("mongoose");

const AnnualLeave = mongoose.model(
  "annual-leave",
  new mongoose.Schema({
    userId: String,
    fullName: String,
    teamName: String,
    teamLeader: String,
    startDate: Date,
    endDate: Date,
    allDay: Boolean,
    type: String,
    status: Number,
    reason: String,
    createdDate: Date,
    createdBy: String,
  })
);

module.exports = AnnualLeave;

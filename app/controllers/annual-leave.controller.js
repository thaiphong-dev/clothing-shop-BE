const db = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const moment = require("moment-timezone");
const AnnualLeave = db.annualLeave;

exports.addAnnualLeave = (req, res) => {
  const bearerHeader = req.headers["authorization"];
  const bearer = bearerHeader.split(" ");
  const token = bearer[1];
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
  });

  const annualLeave = new AnnualLeave({
    userId: req.userId,
    fullName: req.body.fullName,
    teamName: req.body.teamName,
    teamLeader: req.body.teamLeader,
    startDate: moment.utc(req.body.startDate, "YYYY-MM-DD"),
    endDate: moment.utc(req.body.endDate, "YYYY-MM-DD"),
    type: req.body.typeOfLeave,
    allDay: req.body.allDay,
    status: 0,
    reason: req.body.reason,
    createdDate: moment.utc(),
    createdBy: req.userId,
  });
  annualLeave.save((err, annualLeave) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send("Annual Leave was added successfully!");
  });
};

exports.getAll = (req, res, next) => {
  let pageNumber = parseInt(req.query.pageNumber);
  let pageSize = parseInt(req.query.pageSize);
  let keyword = req.query.keyword || "";

  if (pageNumber < 0) pageNumber = 0;
  if (pageSize <= 0 || !pageSize) pageSize = 0;

  AnnualLeave.find(keyword !== "" ? { fullName: { $regex: keyword } } : null)
    .skip(pageSize * pageNumber)
    .limit(pageSize)
    .exec((err, annualLeave) => {
      AnnualLeave.countDocuments((err, count) => {
        if (err) return next(err);
        res.send({ annualLeave: annualLeave, total: annualLeave.length });
      });
    });
};

exports.getAnnualLeave = (req, res) => {
  AnnualLeave.find({ _id: req.params.id }, (err, annualLeave) => {
    if (err) {
      res.status(500).send({ message: err });
    }
    res.send(annualLeave);
  });
};

exports.getAnnualLeaveByUserId = (req, res) => {
  AnnualLeave.find(
    { userId: req.params.userId },
    "userId fullName teamName teamLeader fromDate toDate type status reason createdDate createdBy",
    (err, annualLeave) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.send({ annualLeave: annualLeave, total: annualLeave.length });
    }
  );
};

exports.updateAnnualLeave = (req, res) => {
  let status = parseInt(req.body.status);
  AnnualLeave.findOneAndUpdate(
    { _id: req.params.id },
    { status: status },
    (err, annualLeave) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.send(annualLeave._id);
    }
  );
};

exports.deleteAnnualLeave = (req, res) => {
  AnnualLeave.findOneAndDelete({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send({ message: "Annual Leave was deleted successfully" });
  });
};

const db = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const moment = require("moment");
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
    fromDate: moment.utc(req.body.fromDate, "YYYY-MM-DD"),
    toDate: moment.utc(req.body.toDate, "YYYY-MM-DD"),
    type: req.body.type,
    status: "pending",
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

exports.getAll = (req, res) => {
  AnnualLeave.find(
    {},
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
  AnnualLeave.findOneAndUpdate(
    { _id: req.params.id },
    { status: req.body.status },
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

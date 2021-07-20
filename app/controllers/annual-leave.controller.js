const db = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
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

  const date = new Date();
  let month = date.getMonth() + 1; // because month in js start at 0 = jannuary
  let day = date.getDate();
  if (month < 10) {
    month = "0" + month;
  } else if (day < 10) {
    day = "0" + month;
  }

  const annualLeave = new AnnualLeave({
    fullName: req.body.fullName,
    teamName: req.body.teamName,
    teamLeader: req.body.teamLeader,
    fromDate: req.body.fromDate,
    toDate: req.body.toDate,
    type: req.body.type,
    status: "pending",
    reason: req.body.reason,
    createdDate: `${date.getFullYear()}-${month}-${day}`,
    createdBy: req.userId,
  });
  annualLeave.save((err, annualLeave) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send("AnnualLeave was added successfully!");
  });
};

exports.getAll = (req, res) => {
  AnnualLeave.find(
    {},
    "fullName teamName teamLeader fromDate toDate type status reason createdDate createdBy",
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
  const d = new Date();
  AnnualLeave.find({ _id: req.params.id }, (err, annualLeave) => {
    if (err) {
      res.status(500).send({ message: err });
    }
    res.send(annualLeave);
  });
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
    res.send({ message: "AnnualLeave was deleted successfully" });
  });
};

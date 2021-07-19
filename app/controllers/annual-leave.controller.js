const db = require("../models");

const AnnualLeave = db.annualLeave;

exports.addAnnualLeave = (req, res) => {
  console.log(req);
  const annualLeave = new AnnualLeave({
    fullName: req.body.fullName,
    teamName: req.body.teamName,
    teamLeader: req.body.teamLeader,
    fromDate: req.body.fromDate,
    toDate: req.body.toDate,
    type: req.body.type,
    status: "pending",
    reason: req.body.reason,
    createdDate: req.body.createdDate,
    createdBy: req.body.createdBy,
  });
  annualLeave.save((err, annualLeave) => {
    if (err) {
      console.log(err);
      res.status(500).send({ message: err });
      return;
    }
    res.send("Annual-leave was added successfully!");
  });
};

exports.getAll = (req, res) => {
  AnnualLeave.find(
    {},
    "fullName teamName teamLeader fromDate toDate type status reason createdDate createdDay",
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
    res.send({ message: "Annual-leave was deleted successfully" });
  });
};

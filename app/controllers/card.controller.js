const db = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const moment = require("moment-timezone");
const Card = db.card;

exports.addCard = (req, res) => {
  const card = new Card({
    //   id: String,
    userId: req.body.userId,
    username: req.body.username,
    fullname: req.body.fullname,
    email: req.body.email,
    country: req.body.country,
    address: req.body.address,
    contact: req.body.contact,
    detail: req.body.detail,
    paymentAddress: req.body.paymentAddress,
    paymentDate: moment.utc(),
    paymentType: req.body.paymentType,
    status: req.body.status,
  });
  card.save((err, card) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send("card was added successfully!");
  });
};

exports.getAll = (req, res, next) => {
  let pageNumber = parseInt(req.query.pageNumber);
  let pageSize = parseInt(req.query.pageSize);
  let keyword = req.query.keyword || "";

  if (pageNumber < 0) pageNumber = 0;
  if (pageSize <= 0 || !pageSize) pageSize = 0;

  Card.find(keyword !== "" ? { cardname: { $regex: keyword } } : null)
    .skip(pageSize * pageNumber)
    .limit(pageSize)
    .exec((err, card) => {
      Card.countDocuments((err, count) => {
        if (err) return next(err);
        res.send({ card: card, total: card.length });
      });
    });
};

exports.getCard = (req, res) => {
  Card.find({ _id: req.params.id }, (err, card) => {
    if (err) {
      res.status(500).send({ message: err });
    }
    res.send(card);
  });
};

  exports.getCardByUserId = (req, res) => {
    Card.find(
      { userId: req.params.userId },
      "userId fullName email country address contact detail paymentAddress paymentDate paymentType status",
      (err, card) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.send({ card: card, total: card.length });
      }
    );
  };

exports.updateCard = (req, res) => {
  Card.findOneAndUpdate(
    { _id: req.params.id },
    {
      status: status,
    },
    (err, card) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.send(card._id);
    }
  );
};

exports.deleteCard = (req, res) => {
  Card.findOneAndDelete({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send({ message: "Card was deleted successfully" });
  });
};

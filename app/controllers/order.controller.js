const db = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const moment = require("moment-timezone");
const Order = db.order;

exports.addOrder = (req, res) => {
  const order = new Order({
    //   id: String,
    userId: req.body.userId,
    detail: req.body.detail,
    orderDate: moment.utc(),
    status: req.body.status,
  });
  order.save((err, order) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send("order was added successfully!");
  });
};

exports.getAll = (req, res, next) => {
  let pageNumber = parseInt(req.query.pageNumber);
  let pageSize = parseInt(req.query.pageSize);
  let keyword = req.query.keyword || "";

  if (pageNumber < 0) pageNumber = 0;
  if (pageSize <= 0 || !pageSize) pageSize = 0;

  Order.find(keyword !== "" ? { ordername: { $regex: keyword } } : null)
    .skip(pageSize * pageNumber)
    .limit(pageSize)
    .exec((err, order) => {
      Order.countDocuments((err, count) => {
        if (err) return next(err);
        res.send({ order: order, total: order.length });
      });
    });
};

exports.getOrder = (req, res) => {
  Order.find({ _id: req.params.id }, (err, order) => {
    if (err) {
      res.status(500).send({ message: err });
    }
    res.send(order);
  });
};

  exports.getOrderByUserId = (req, res) => {
    Order.find(
      { userId: req.params.userId },
      "userId detail orderDate status",
      (err, order) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.send({ order: order, total: order.length });
      }
    );
  };

exports.updateOrder = (req, res) => {
  let status = parseInt(req.body.status);
  Order.findOneAndUpdate(
    { _id: req.params.id },
    {
      status: status,
    },
    (err, order) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.send(order._id);
    }
  );
};

exports.deleteOrder = (req, res) => {
  Order.findOneAndDelete({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send({ message: "Order was deleted successfully" });
  });
};
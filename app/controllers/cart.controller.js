const db = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const moment = require("moment-timezone");
const Cart = db.cart;
const Product = db.product;

exports.addCart = (req, res) => {
  const cart = new Cart({
    //   id: String,
    userId: req.body.userId,
    detail: req.body.detail,
    cartDate: moment.utc(),
    status: req.body.status,
  });
  cart.save((err, cart) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send("cart was added successfully!");
  });
};

exports.getAll = (req, res, next) => {
  let pageNumber = parseInt(req.query.pageNumber);
  let pageSize = parseInt(req.query.pageSize);
  let keyword = req.query.keyword || "";

  if (pageNumber < 0) pageNumber = 0;
  if (pageSize <= 0 || !pageSize) pageSize = 0;

  Cart.find(keyword !== "" ? { cartname: { $regex: keyword } } : null)
    .skip(pageSize * pageNumber)
    .limit(pageSize)
    .exec((err, cart) => {
      Cart.countDocuments((err, count) => {
        if (err) return next(err);
        res.send({ cart: cart, total: count });
      });
    });
};

exports.getCart = (req, res) => {
  Cart.find({ _id: req.params.id }, (err, cart) => {
    if (err) {
      res.status(500).send({ message: err });
    }
    res.send(cart);
  });
};

  exports.getCartByUserId = (req, res) => {
    Cart.findOne(
      { userId: req.params.userId },
      (err, cart) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.send(cart);
      }
    );
  };

exports.updateCart = (req, res) => {
  let status = parseInt(req.body.status);
  let detail = []
  let detailReq = req.body.detail
  detailReq?.forEach(item => {

    Product.findOne(
      { _id: item.productId },
      (err, product) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        detail.push({
          ...item,
          product: product
        })
      }
    );

  })

  setTimeout((detail) => {
    Cart.findOneAndUpdate(
      { _id: req.params.id },
      {
  
        detail: detail,
        cartDate: moment.utc(),
        status: status,
      },
      (err, cart) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.send(detail)
      }
    );
  }, 500, detail);
  
};

exports.deleteCart = (req, res) => {
  Cart.findOneAndDelete({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send({ message: "Cart was deleted successfully" });
  });
};

const db = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const moment = require("moment-timezone");
const Order = db.order;
const Product = db.product
exports.addOrder = (req, res) => {

  let product = {
    id: "",
    productname: "",
    price: 0,
    preview: "",
    image: "",
    productType: "",
    gender: 0,
    productInfo: [
        {
          size: "",
          amount: 0,
        },
      ],
    status: 0
  }

  let detail = []
  let detailReq = req.body.detail

  
  detailReq?.forEach(item => {

    Product.findOne(
      { _id: item.productId },
      (err, productres) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if(!product.id || product?.id !== item.productId){
        
        product.id = productres._id
        product.productname = productres.productname
        product.preview = productres.preview
        product.price = productres.price
        product.image = productres.image
        product.productInfo = productres.productInfo
        product.status = productres.status

        }
        product.productInfo.forEach(x => {
          if(x.size == item.size){
            x.amount = x.amount - item.amount
          }

        })

        console.log("product", product);

        setTimeout((product) => {
          Product.findOneAndUpdate(
            { _id: product.id },
            {
                productname: product.productname,
                price: product.price,
                preview: product.preview,
                image: product.image,
                productType: product.productType,
                gender: product.gender,
                productInfo: product.productInfo,
                status: product.status,
            },
            (err, product) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                // res.send("Product was updated successfully");
            }
        );
        }, 1000, product);
        


        detail.push({
          ...item,
          product: productres
        })
      }
    );

  })

setTimeout((detail) => {
  const order = new Order({
    //   id: String,
    userId: req.body.userId,
    username: req.body.username,
    fullname: req.body.fullname,
    email: req.body.email,
    country: req.body.country,
    address: req.body.address,
    contact: req.body.contact,
    detail: detail,
    paymentAddress: req.body.paymentAddress,
    paymentDate: moment.utc(),
    paymentType: req.body.paymentType,
    status: req.body.status,
  });
  order.save((err, order) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send("order was added successfully!");
  });
}, 1000, detail);
  
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

  Order.findOne({ _id: req.params.id }, (err, order) => {
    if (err) {
      res.status(500).send({ message: err });
    }
    res.send(order);
  });
};

  exports.getOrderByUserId = (req, res) => {
    Order.find(
      { userId: req.params.userId },
      (err, order) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.send(order);
      }
    );
  };

  exports.getOrderByStatus = (req, res) => {
    let status = parseInt(req.body.status)
    Order.find(
      { status: status },
      (err, order) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.send(order);
      }
    );
  };

exports.updateOrder = (req, res) => {
  let status = parseInt(req.body.status);
  Order.findOneAndUpdate(
    { _id: req.params.id },
    {
      status: status
    },
    (err, order) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.send("Order was updated successfully");
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

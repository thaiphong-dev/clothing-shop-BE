const db = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const moment = require("moment-timezone");
const Product = db.product;


exports.addProduct = (req, res) => {
    const product = new Product({
        //   id: String,
        productname: req.body.productname,
        price: req.body.price,
        preview: req.body.preview,
        image: req.body.image,
        productType: req.body.productType,
        gender: req.body.gender,
        productInfo: req.body.productInfo,
        status: req.body.status,
    });
    product.save((err, product) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.send("product was added successfully!");
    });
};

exports.getAll = (req, res, next) => {
    let pageNumber = parseInt(req.query.pageNumber);
    let pageSize = parseInt(req.query.pageSize);
    let keyword = req.query.keyword || "";

    if (pageNumber < 0) pageNumber = 0;
    if (pageSize <= 0 || !pageSize) pageSize = 0;

    Product.find(keyword !== "" ? { productname: { $regex: keyword } } : null)
        .skip(pageSize * pageNumber)
        .limit(pageSize)
        .exec((err, product) => {
            Product.countDocuments((err, count) => {
                if (err) return next(err);
                res.send({ product: product, total: product.length });
            });
        });
};

exports.getProduct = (req, res) => {
    Product.findOne({ _id: req.params.id }, (err, product) => {
        if (err) {
            res.status(500).send({ message: err });
        }
        res.send(product);
    });
};


exports.updateProduct = (req, res) => {
    let status = parseInt(req.body.status);
    Product.findOneAndUpdate(
        { _id: req.params.id },
        {
            productname: req.body.productname,
            price: req.body.price,
            preview: req.body.preview,
            image: req.body.image,
            productType: req.body.productType,
            gender: req.body.gender,
            productInfo: req.body.productInfo,
            status: req.body.status,
        },
        (err, product) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            res.send("Product was updated successfully");
        }
    );
};

exports.deleteProduct = (req, res) => {
    Product.findOneAndDelete({ _id: req.params.id }, (err) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.send({ message: "Product was deleted successfully" });
    });
};
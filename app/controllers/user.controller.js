var config = require("../config/db.config");
const sql = require("mssql")

const db = require("../models");

const bcrypt = require("bcryptjs");
const config = require("../config/auth.config");

const User = db.user;
const Role = db.role;
var jwt = require("jsonwebtoken");

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.addUser = async (req, res) => {
  try {
    let connection = await sql.connect(config);
    let result = await connection.request()
            .input('hoTen', sql.NVarChar, req.body.username)
            .input('sdt', sql.VarChar, req.body.sdt.toString())
            .input('email', sql.VarChar, req.body.email)
            .input('diaChi', sql.NVarChar, req.body.address)
            .input('cmnd', sql.VarChar, req.body.cmnd.toString())
            .input('password', sql.VarChar, req.body.password)
            .input('maQuyen', sql.Int, 4)
            .execute("sp_TaoTaiKhoanChoKhachHang");
    console.log("ds result", result);

    return res.status(200).send({data:result.recordsets});
} catch (error) {
    console.log(error)
}


        
        

};

exports.getAll = (req, res, next) => {
  // add pagiantion
  let pageNumber = parseInt(req.query.pageNumber);
  let pageSize = parseInt(req.query.pageSize);
  let keyword = req.query.keyword || "";

  if (pageNumber < 0) pageNumber = 0;
  if (pageSize <= 0 || !pageSize) pageSize = 0;

  User.find(keyword !== "" ? { fullname: { $regex: keyword } } : null)
    .skip(pageSize * pageNumber)
    .limit(pageSize)
    .exec((err, users) => {
      User.countDocuments((err, count) => {
        if (err) return next(err);
        res.send({ users: users, total: count });
      });
    });
};

exports.getUser = (req, res) => {
  User.find({ _id: req.params.id }, (err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send(user);
  });
};

exports.searchUser = (req, res) => {
  let reqStatus = req.body[0].value;
  let reqRole = req.body[1].value;

  if (reqStatus === 0 && reqRole != "") {
    User.find({ roles: reqRole }, (err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.send({ user: user, total: user.length });
    });
  } else if (reqStatus != 0 && reqRole == "") {
    User.find({ status: parseInt(reqStatus) }, (err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.send({ user: user, total: user.length });
    });
  } else if (reqStatus != 0 && reqRole != "") {
    User.find(
      {
        $and: [{ status: parseInt(reqStatus) }, { roles: reqRole }],
      },
      (err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.send({ user: user, total: user.length });
      }
    );
  }
};

exports.updateUser = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.id },
    {
      fullname: req.body.fullname,
      avatar: req.body.avatar,
      userRole: req.body.userRole || "user",
      address: req.body.address,
      contact: req.body.contact,
    },
    (err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      // update

      res.send(user);
    }
  );
};

exports.deleteUser = (req, res) => {
  User.findOneAndDelete({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send({ message: "User was deleted successfully!" });
  });
};

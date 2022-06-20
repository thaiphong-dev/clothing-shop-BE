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

exports.addUser = (req, res) => {
  const user = new User({
    fullname: req.body.fullname,
    username: req.body.username,
    email: req.body.email,
    avatar: req.body.avatar || "",
    role: req.body.role || "user",
    address: req.body.address,
    contact: req.body.contact,
    status: req.body.status || 2,

    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    var token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    var refreshToken = jwt.sign({ id: user.id }, config.secretRefreshToken, {
      expiresIn: 86400, // 24 hours
    });

    res.status(200).send({
      accessToken: token,
      refreshToken: refreshToken,
      userData: {
        id: user._id,
        fullName: user.fullname,
        username: user.username,
        contact: user.contact,
        address: user.address,
        avatar: "",
        email: user.email,
        role: user.role,
      },
    });
  });
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

// exports.changePassword = (req, res) => {
//   User.findOneAndUpdate(
//     { email: req.body.email },
//     {
//       password: bcrypt.hashSync(req.body.password, 8),
//     },
//     (err, user) => {
//       if (err) {
//         res.status(500).send({ message: err });
//         return;
//       }
//       // update
//       res.send(user);
//     }
//   );
// };

exports.updateUser = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.id },
    {
      fullname: req.body.fullname,
      avatar: req.body.avatar,
      role: req.body.role || "user",
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

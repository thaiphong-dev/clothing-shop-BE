const db = require("../models");
const bcrypt = require("bcryptjs");

const User = db.user;
const Role = db.role;

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
    // contact: req.body.contact,
    // status: req.body.status,
    // avatar: req.body.avatar,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          _id: { $in: req.body.roles[0] },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was added successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "Client" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was added successfully!" });
        });
      });
    }
  });
};

exports.getAll = (req, res, next) => {
  // add pagiantion
  let perPage = 2;
  let page = req.query.page;
  if (!page) perPage = 0;
  User.find({}, "fullname username email roles")
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec((err, users) => {
      User.countDocuments((err, count) => {
        if (err) return next(err);
        res.send({ users: users, total: users.length });
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

exports.updateUser = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.id },
    { fullName: req.body.fullName },
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

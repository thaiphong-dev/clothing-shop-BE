const config = require("../config/auth.config");
const db = require("../models");
const sendEmailConfig = require("../config/sendEmail.config")
const sendEmail = require("../util/sendEmail")

const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { json } = require("body-parser");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });


  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "Email or Password is invalid!" });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Email or Password is invalid!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var refreshToken = jwt.sign({ id: user.id }, config.secretRefreshToken, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push(user.roles[i].name.toLowerCase());
      }

      // TODO: get data from server
      res.status(200).send({
        accessToken: token,
        refreshToken: refreshToken,
        userData: {
          id: user._id,
          fullName: user.fullname,
          username: user.username,
          contact: user.contact,
          address: user.address,
          avatar: user.avatar,
          email: user.email,
          userRole: user.userRole,
          role: authorities,
          ability: [
            {
              action: 'manage',
              subject: 'all'
            }
          ]
        },
      });
    });
};

exports.refreshToken = (req, res) => {
  const refreshToken = req.body.refreshToken;

  try {
    const { id } = jwt.verify(refreshToken, config.secret)

    const userData = { ...data.users.find(user => user.id === id) }

    const newAccessToken = jwt.sign({ id: userData.id }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn })
    const newRefreshToken = jwt.sign({ id: userData.id }, jwtConfig.secretRefreshToken, {
      expiresIn: jwtConfig.refreshTokenExpireTime
    })

    delete userData.password
    const response = {
      userData,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }
    return res.status(200).send(response);
  } catch (e) {
    return res.status(401).send({ message: "Invalid refresh token" });
  }
}

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user =  await User.findOne({ email }, (err, user) => {
      if( err || !user) {
        return res.status(400).send({ error: "User with this email doesn't exist!" })
      }  
    });
    const token = jwt.sign({ id: user._id }, sendEmailConfig.reset_password_key, { expiresIn: '30m'})

    sendEmail(
      email,
      'tuthaiphong701@gmail.com',
      'Reset Password Link',
      `
      <h2>Please click on the given link to reset your password</h2>
      <p>${sendEmailConfig.local_url}/auth/reset-password/${token}</p>
      `
    );
    return res.status(200).send({ message: 'Email has been sent, kindly follow the instruction' });
  } catch (e) {
    return json("Something wrong")
  }
},

exports.resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body
    const { token } = req.params
    const hashed = bcrypt.hashSync(password, 8)

    if(token) {
      jwt.verify(token, sendEmailConfig.reset_password_key, (err, decoded) => {
        if (err) {
          return res.status(401).json({ error: "Incorrect link or it is expired" });
        }
        req.userId = decoded.id
      })
    }

    await User.findOneAndUpdate( req.userId, {password: hashed} , { useFindAndModify:false }, (err, user) => {
      if( err || !user) 
      return res.status(400).json({ error: "Password change failed. Please check your email" })
    })
    return res.status(200).json({ message: "Your password has been changed" })
  } catch(e) {
    return json("Something wrong")
  }
}
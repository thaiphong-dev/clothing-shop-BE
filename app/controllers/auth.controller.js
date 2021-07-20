const config = require("../config/auth.config");
const db = require("../models");
const sendEmailConfig = require("../config/sendEmail.config")
const sgMail = require("@sendgrid/mail")
const sendEmail = require("../util/sendEmail")

const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

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
        authorities.push(user.roles[i].name.toUpperCase());
      }

      // TODO: get data from server
      res.status(200).send({
        accessToken: token,
        refreshToken: refreshToken,
        userData: {
          id: user._id,
          fullName: 'John Doe',
          username: user.username,
          password: 'admin',
          avatar: '/static/media/avatar-s-11.1d46cc62.jpg',
          email: user.email,
          role: authorities,
          ability: [
            {
              action: 'manage',
              subject: 'all'
            }
          ],
          extras: {
            eCommerceCartItemsCount: 15
          }
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

exports.forgotPassword = (req, res) => {
  const { email } = req.body
  sgMail.setApikey = 

  User.findOne( { email }, (err, user) => {
    if( err || !user) {
      return res.status(400).send({ error: "User with this email doesn't exist!" })
    }

    const token = jwt.sign({ id: user.id }, sendEmailConfig.reset_password_key, { expiresIn: '30m'})
    return user.updateOne({ resetLink: token }, (err, success) => {
      if(err) {
        return res.status(400).json({ err: "reset password link error" })
      } else {
        sendEmail(
          email,
          'anh.ha@alpaca.vn',
          'Reset Password Link',
          `
          <h2>Please click on the given link to reset your password</h2>
          <p>${sendEmailConfig.local_url}/reset-password/${token}</p>
          `
        )
        return res.json({ message: "Email has been sent, kindly follow the instruction" })
      }
    })
  })
}

exports.resetPassword = async(req, res) => {
  try {
    const { resetLink, password } = req.body
    if(resetLink) {
      jwt.verify(resetLink, sendEmailConfig.reset_password_key, (err, decoded) => {
        req.userId = decoded.id
        if(err){
          return res.status(401).json({ error: "Incorrect link or it is expired" })
        }
      })
    }
    await User.findByIdAndUpdate( req.userId , password, (err, user) => {
      if( err || !user) return res.status(400).json({ error: "User does not exist " })
      bcrypt.hash(password, 8).then((hashed) => {
        user.password = hashed
        user.resetLink = ''
        user.save((err, result) => {
          if(err) return res.status(400).json( {error: "reset password failed" })
        return res.status(200).json({ message: "Your password has been changed" })
        })
      })
    })
  } catch(e) {
    return res.status(401).json({ error: "Authentication failed" })
  }
}
const authConfig = require("../config/auth.config");
const db = require("../models");
const sendEmailConfig = require("../config/sendEmail.config")
const sendEmail = require("../util/sendEmail")
const sql = require("mssql")
var config = require("../config/db.config");

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

exports.signin = async (req, res) => {
  try {
    let connection = await sql.connect(config);
    let result = await connection.request()
            .input('email', sql.VarChar, req.body.email)
            .input('password', sql.VarChar, req.body.password)
            .execute("sp_DangNhap");
    var token = jwt.sign({ id: result.recordset[0].email }, authConfig.secret, {
      expiresIn: 86400 // 24 hours
    });

    let tk = await connection.request().query(`SELECT * FROM TaiKhoan`)

    let data = result.recordset.map( x => ({...x, maQuyen: tk.recordset.filter( y => y.maTK === x.maTK)[0].maQuyen}))

    let response = {
      token: token,
      ...data[0]
    }
    console.log("ds result", response);

    // var refreshToken = jwt.sign({ id: user.id }, config.secretRefreshToken, {
    //   expiresIn: 86400 // 24 hours
    // });

    // var authorities = [];

    return res.status(200).send({data:response});
} catch (error) {
     return res.status(400).send({message:error})
}
};

exports.refreshToken = (req, res) => {
  const refreshToken = req.body.refreshToken;

  try {
    const { id } = jwt.verify(refreshToken, authConfig.secret)

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
      'anh.ha@alpaca.vn',
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
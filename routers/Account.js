const express = require("express");
const accRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../configs/passport");
const JWT = require("jsonwebtoken");
const Account = require("../models/Account");
const bcrypt = require("bcrypt");
const lodash = require("lodash");

accRouter.post("/register", (req, res) => {
  const { email, username, password, role } = req.body;
  Account.findOne(
    { $or: [{ username: username }, { email: email }] },
    (err, user) => {
      if (err)
        res.status(500).json({
          message: {
            msgBody: "Có lỗi khi tìm kiếm với CSDL 1",
            msgError: true,
          },
        });
      else if (user) {
        res.status(201).json({
          message: {
            msgBody: "Tên đăng nhập hoặc email đã tồn tại",
            msgError: true,
          },
        });
      } else if (role === "spadmin" || role === "admin") {
        res.status(201).json({
          message: {
            msgBody: "Không có loại tài khoản này",
            msgError: true,
          },
        });
      } else {
        const newAccount = new Account({ email, username, password, role });
        newAccount.save((err) => {
          if (err)
            res.status(500).json({
              message: {
                msgBody: "Có lỗi khi thêm tài khoản vào CSDL 2",
                msgError: true,
                err,
              },
            });
          else
            res.status(200).json({
              message: {
                msgBody: "Tạo tài khoản thành công",
                msgError: false,
              },
            });
        });
      }
    }
  );
});

const signToken = (userID) => {
  return JWT.sign(
    {
      iss: "QuocLiem",
      sub: userID,
    },
    "QuocLiem",
    { expiresIn: "1d" }
  );
};

accRouter.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    if (req.isAuthenticated()) {
      const { _id, username, role, status } = req.user;
      const token = signToken(_id);
      res.cookie("access_token", token, { httpOnly: true, sameSite: true });
      res
        .status(200)
        .json({ isAuthenticated: true, user: { _id, username, role, status } });
    }
  }
);

accRouter.get(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.clearCookie("access_token");
    res.json({ user: { username: "", role: "" }, success: true });
  }
);

accRouter.post(
  "/changePass",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { old_Password, password, configPassword } = req.body;
    const { username, email } = req.user;
    Account.findOne(
      { $or: [{ username: username }, { email: email }] },
      (err, user) => {
        if (err || !user) {
          return res.status(500).json({
            message: {
              msgBody: "Lỗi hoặc tài khoản không tồn tại",
              msgError: true,
            },
            err,
          });
        }
        if (password !== configPassword) {
          return res.status(400).json({
            message: {
              msgBody: "Mật khẩu xác nhận không đúng",
              msgError: true,
            },
          });
        }
        bcrypt.compare(
          old_Password,
          req.user.password,
          function (err, isMatch) {
            console.log(err);
          }
        );
        bcrypt.compare(
          old_Password,
          req.user.password,
          function (err, isMatch) {
            if (err) {
              res.status(400).json({
                message: {
                  msgBody: "Có Lỗi!!!",
                  msgError: true,
                },
                err,
              });
            }
            if (!isMatch) {
              res.status(400).json({
                isMatch: isMatch,
                message: {
                  msgBody: "Mật khẩu cũ không đúng",
                  msgError: true,
                },
              });
            } else {
              const updatePassword = {
                password: password,
              };
              user = lodash.extend(user, updatePassword);
              user.save((err, result) => {
                if (err) {
                  return res.status(500).json({
                    message: {
                      msgBody: "Lỗi thêm không thành công",
                      msgError: true,
                    },
                    err,
                  });
                }
                res.status(200).json({
                  message: {
                    msgBody: "Thay Đổi Mật Khẩu Thành Công",
                    msgError: false,
                  },
                });
              });
            }
          }
        );
      }
    );
  }
);

accRouter.get(
  "/authenticated",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { _id, username, role, status } = req.user;
    res.status(200).json({
      isAuthenticated: true,
      user: {
        _id,
        username,
        role,
        status,
      },
    });
  }
);

module.exports = accRouter;

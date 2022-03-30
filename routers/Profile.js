const express = require("express");
const passport = require("passport");
const Profile = require("../models/Profile");
const profileRouter = express.Router();

profileRouter.post(
  "/createProfile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const {
      name,
      birthday,
      sdt,
      email,
      degree,
      experience,
      skill,
      hobby,
      target,
      gender,
    } = req.body;
    const account = req.user._id;
    const { role } = req.user;
    const newProfile = new Profile({
      name,
      birthday,
      sdt,
      email,
      degree,
      experience,
      skill,
      hobby,
      target,
      gender,
      account,
    });
    if (role === "candidate") {
      Profile.findOne({ account: account }, (err, exist) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: {
              msgBody: "Có lỗi khi lấy dữ liệu",
              msgError: true,
            },
            err,
          });
        } else {
          if (exist) {
            res.status(203).json({
              success: false,
              message: {
                msgBody: "Tài khoản này đã tạo hồ sơ rồi",
                msgError: true,
              },
              existProfile: true,
            });
          } else {
            newProfile.save((err, result) => {
              if (err) {
                if (err.code === 11000) {
                  res.status(203).json({
                    success: false,
                    message: {
                      msgBody: "Email này đã được sử dụng để tạo hồ sơ",
                      msgError: true,
                    },
                    existEmail: true,
                  });
                  return;
                }
                res.status(203).json({
                  success: false,
                  message: {
                    msgBody:
                      "Có lỗi khi tạo hồ sơ vui lòng nhập đầy đủ thông tin",
                    msgError: true,
                  },
                  err,
                });
                return;
              } else {
                res.status(200).json({
                  success: true,
                  message: {
                    msgBody: "Tạo hồ sơ thành công",
                    msgError: false,
                  },
                  result,
                });
              }
            });
          }
        }
      });
    } else {
      res.status(203).json({
        success: false,
        message: {
          msgBody: "Tài khoản không có chức năng này",
          msgError: true,
        },
      });
    }
  }
);

profileRouter.get(
  "/getProfile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const account = req.user._id;
    const { role } = req.user;
    if (role === "candidate") {
      Profile.findOne({ account: account }, (err, prof) => {
        if (err) {
          res.status(201).json({
            success: false,
            message: {
              msgBody: "Load hồ sơ không thành công",
              msgError: true,
            },
            err,
          });
        }
        if (!prof) {
          res.status(203).json({
            success: true,
            message: {
              msgBody: "Tài khoản chưa tạo hồ sơ",
              msgError: false,
            },
            existProfile: false,
            prof,
          });
          return;
        }
        res.status(200).json({
          success: true,
          message: {
            msgBody: "Load hồ sơ thành công",
            msgError: false,
          },
          existProfile: true,
          prof,
        });
      });
    } else {
      res.status(203).json({
        success: false,
        message: {
          msgBody: "Tài khoản không có quyền",
          msgError: true,
        },
      });
    }
  }
);

profileRouter.post(
  "/updateProfile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const data = ({
      name,
      birthday,
      sdt,
      email,
      degree,
      experience,
      skill,
      hobby,
      target,
      gender,
    } = req.body);
    const account = req.user._id;
    const updates = data;
    const options = { new: true };

    const { role } = req.user;
    if (role === "candidate") {
      Profile.updateOne({ account: account }, updates, options)
        .then((result) => {
          if (result.nModified < 1) {
            res.status(200).json({
              success: true,
              message: {
                msgBody: "Cập nhật hồ sơ không thành công",
                msgError: true,
              },
            });
          }
          res.status(200).json({
            success: true,
            message: {
              msgBody: "Cập nhật hồ sơ thành công",
              msgError: false,
            },
            result,
          });
        })
        .catch((err) => {
          if (err.code === 11000) {
            res.status(203).json({
              success: false,
              message: {
                msgBody: "Email này đã được sử dụng để tạo hồ sơ",
                msgError: true,
              },
              existEmail: true,
            });
            return;
          }
          res.status(400).json({
            success: false,
            message: {
              msgBody: "Cập nhật không thành công vui lòng xem lại thông tin",
              msgError: true,
            },
            err,
          });
          return;
        });
    } else {
      res.status(203).json({
        success: false,
        message: {
          msgBody: "Tài khoản không có chức năng này",
          msgError: true,
        },
      });
    }
  }
);

module.exports = profileRouter;

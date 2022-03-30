const express = require("express");
const CV = require("../models/CV");
const Recruitment = require("../models/Recruitment");
const Profile = require("../models/Profile");
const cVRouter = express.Router();
const passport = require("passport");

cVRouter.post(
  "/createCV",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { profile, recruitment, receiver } = req.body;

    const { status, role } = req.user;
    const writer = req.user._id;
    if (status || role === "candidate") {
      Profile.findOne({ _id: profile }, (err, prof) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: {
              msgBody: "Lỗi!!!",
              msgError: true,
            },
            err,
          });
          return;
        } else {
          CV.find(
            { recruitment: recruitment, writer: writer },
            (err, exist) => {
              if (err) {
                res.status(400).json({
                  success: false,
                  message: {
                    msgBody: "Lỗi!!!",
                    msgError: true,
                  },
                  err,
                });
                return;
              }
              if (exist.length >= 1) {
                res.status(203).json({
                  success: false,
                  message: {
                    msgBody: "Bạn đã gửi thông tin đến nhà tuyển dụng này rồi",
                    msgError: true,
                  },
                });
              } else {
                const newCV = new CV({
                  profile: prof,
                  recruitment,
                  writer,
                  receiver,
                });

                newCV.save((err, result) => {
                  if (err) {
                    res.status(400).json({
                      success: false,
                      message: {
                        msgBody: "Có lỗi khi thêm dữ liệu",
                        msgError: true,
                      },
                      err,
                    });
                  } else {
                    Recruitment.updateOne(
                      { _id: recruitment },
                      { $push: { cv: newCV } },
                      (err, cpl) => {
                        if (err) {
                          res.status(400).json({
                            message: {
                              msgBody: "Có lỗi tuyển dụng không tồn tại",
                              msgError: true,
                            },
                          });
                        }
                      }
                    );
                    return res.status(200).json({
                      success: true,
                      message: {
                        msgBody: "Gửi thông tin thành công",
                        msgError: false,
                      },
                      result,
                    });
                  }
                });
              }
            }
          );
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: {
          msgBody: "Tài khoản này đã bị khoá hoặc không có quyền",
          msgError: true,
        },
      });
    }
  }
);

cVRouter.post("/getCV", (req, res) => {
  const { idRecruitment } = req.body;
  CV.find({ recruitment: idRecruitment }, (err, result) => {
    if (err) {
      res.status(404).json({
        success: false,
        message: {
          msgBody: "Không có dữ liệu",
          magError: true,
        },
        err,
      });
    } else {
      res.status(200).json({
        success: true,
        message: {
          msgBody: "Load dữ liệu thành công",
          magError: false,
        },
        result,
      });
    }
  });
});

cVRouter.get(
  "/getMyCV",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const writer = req.user._id;
    CV.find({ writer }, (err, result) => {
      if (err) {
        res.status(400).json({
          success: false,
          message: {
            msgBody: "Lôi!!!",
            msgError: true,
          },
          err,
        });
      } else {
        res.status(200).json({
          success: true,
          message: {
            msgBody: "Load dữ liệu thành công",
            msgError: false,
          },
          result,
        });
      }
    });
  }
);

cVRouter.post(
  "/getCVByReceiverTrue",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const receiver = req.user._id;
    const pageSize = 3;
    var page = req.query.page;
    if (page) {
      if (page < 1 || page === 0) {
        page = 1;
      }
      page = parseInt(page);
      var skip = (page - 1) * pageSize;
      CV.find({ receiver: receiver, status: true })
        .populate("recruitment", "title")
        .skip(skip)
        .limit(pageSize)
        .exec((err, result) => {
          if (err) {
            res.status(400).json({
              success: false,
              message: {
                msgBody: "Có Lỗi Khi Lấy Dữ Liệu",
                msgError: true,
              },
              err,
            });
            return;
          } else {
            CV.countDocuments(
              { receiver: receiver, status: true },
              (err, total) => {
                if (err) {
                  res.status(400).json({
                    success: false,
                    message: {
                      msgBody: "Load Dữ Liệu Không Thành Công",
                      msgError: true,
                    },
                    err,
                  });
                } else {
                  res.status(200).json({
                    success: true,
                    message: {
                      msgBody: "Load Dữ Liệu Thành Công",
                      msgError: false,
                    },
                    result,
                    total,
                  });
                }
              }
            );
          }
        });
    } else {
      CV.find({ receiver: receiver, status: true })
        .populate("recruitment", "title")
        .skip(0)
        .limit(pageSize)
        .exec((err, result) => {
          if (err) {
            res.status(400).json({
              success: false,
              message: {
                msgBody: "Có Lỗi Khi Lấy Dữ Liệu",
                msgError: true,
              },
              err,
            });
            return;
          } else {
            CV.countDocuments(
              { receiver: receiver, status: true },
              (err, total) => {
                if (err) {
                  res.status(400).json({
                    success: false,
                    message: {
                      msgBody: "Load Dữ Liệu Không Thành Công",
                      msgError: true,
                    },
                    err,
                  });
                } else {
                  res.status(200).json({
                    success: true,
                    message: {
                      msgBody: "Load Dữ Liệu Thành Công",
                      msgError: false,
                    },
                    result,
                    total,
                  });
                }
              }
            );
          }
        });
    }
  }
);

cVRouter.post(
  "/getCVByReceiverFalse",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const receiver = req.user._id;
    const pageSize = 3;
    var page = req.query.page;
    if (page) {
      if (page < 1 || page === 0) {
        page = 1;
      }
      page = parseInt(page);
      var skip = (page - 1) * pageSize;
      CV.find({ receiver: receiver, status: false })
        .populate("recruitment", "title")
        .skip(skip)
        .limit(pageSize)
        .exec((err, result) => {
          if (err) {
            res.status(400).json({
              success: false,
              message: {
                msgBody: "Có Lỗi Khi Lấy Dữ Liệu",
                msgError: true,
              },
              err,
            });
            return;
          } else {
            CV.countDocuments(
              { receiver: receiver, status: false },
              (err, total) => {
                if (err) {
                  res.status(400).json({
                    success: false,
                    message: {
                      msgBody: "Load Dữ Liệu Không Thành Công",
                      msgError: true,
                    },
                    err,
                  });
                } else {
                  res.status(200).json({
                    success: true,
                    message: {
                      msgBody: "Load Dữ Liệu Thành Công",
                      msgError: false,
                    },
                    result,
                    total,
                  });
                }
              }
            );
          }
        });
    } else {
      CV.find({ receiver: receiver, status: false })
        .populate("recruitment", "title")
        .skip(0)
        .limit(pageSize)
        .exec((err, result) => {
          if (err) {
            res.status(400).json({
              success: false,
              message: {
                msgBody: "Có Lỗi Khi Lấy Dữ Liệu",
                msgError: true,
              },
              err,
            });
            return;
          } else {
            CV.countDocuments(
              { receiver: receiver, status: false },
              (err, total) => {
                if (err) {
                  res.status(400).json({
                    success: false,
                    message: {
                      msgBody: "Load Dữ Liệu Không Thành Công",
                      msgError: true,
                    },
                    err,
                  });
                } else {
                  res.status(200).json({
                    success: true,
                    message: {
                      msgBody: "Load Dữ Liệu Thành Công",
                      msgError: false,
                    },
                    result,
                    total,
                  });
                }
              }
            );
          }
        });
    }
  }
);

cVRouter.post(
  "/detailsCV",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { _id } = req.user;
    const { idCV } = req.body;

    CV.findOne({ _id: idCV, receiver: _id }, (err, result) => {
      if (err) {
        res.status(400).json({
          success: false,
          message: {
            msgBody: "Có Lỗi Khi Lấy Dữ Liệu",
            msgError: true,
          },
          err,
        });
      } else {
        res.status(200).json({
          success: true,
          message: {
            msgBody: "Load dữ liệu thành công",
            msgError: false,
          },
          result,
        });
      }
    }).populate("recruitment", "title");
  }
);

cVRouter.post(
  "/updateStatusCV",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { _id } = req.user;
    const { idCV, statusCV } = req.body;
    CV.updateOne(
      { _id: idCV, receiver: _id },
      { status: statusCV },
      (err, result) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: {
              msgBody: "Lỗi!!!",
              msgError: true,
            },
            err,
          });
        }
        if (result.nModified <= 0) {
          res.status(203).json({
            success: false,
            message: {
              msgBody: "Cập Nhật Không Thành Công",
              msgError: true,
            },
            result,
          });
        } else {
          res.status(200).json({
            success: true,
            message: {
              msgBody: "Cập Nhật Thành Công",
              msgError: false,
            },
            result,
          });
        }
      }
    );
  }
);

cVRouter.post(
  "/deleteCV",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const receiver = req.user._id;
    const { _id } = req.body;
    CV.deleteOne({ _id: _id, receiver: receiver }, (err, result) => {
      if (err) {
        res.status(400).json({
          success: false,
          message: {
            msgBody: "Có Lỗi Xãy Ra!!!",
            msgError: true,
          },
          err,
        });
        return;
      }
      if (result.deletedCount < 1) {
        return res.status(400).json({
          success: false,
          message: {
            msgBody: "Xoá không thành công",
            msgError: true,
          },
        });
      } else {
        return res.status(200).json({
          success: true,
          message: {
            msgBody: "Xoá thành công",
            msgError: false,
          },
        });
      }
    });
  }
);

module.exports = cVRouter;

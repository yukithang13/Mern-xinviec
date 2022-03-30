const express = require("express");
const adminRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../configs/passport");
const JWT = require("jsonwebtoken");
const Account = require("../models/Account");
const lodash = require("lodash");
const Recruitment = require("../models/Recruitment");

adminRouter.get(
  "/getAccount",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { _id } = req.user;
    if (req.user.role === "spadmin" || req.user.role === "admin") {
      const pageSize = 10;
      var page = req.query.page;
      if (page) {
        if (page < 1 || page === 0) {
          page = 1;
        }
        page = parseInt(page);
        var skip = (page - 1) * pageSize;
        if (req.user.role === "spadmin") {
          Account.find({ _id: { $ne: _id } }, { password: 0 })
            .skip(skip)
            .limit(pageSize)
            .sort({ createdAt: -1, updatedAt: -1 })
            .exec((err, result) => {
              if (err) {
                res.status(404).json({
                  success: false,
                  message: {
                    msgBody: "Không tìm thấy dữ liệu",
                    msgError: true,
                  },
                  err,
                });
                return;
              } else {
                Account.countDocuments(
                  { _id: { $ne: _id } },
                  (err, totalAccount) => {
                    if (err) {
                      res.status(400).json({
                        success: false,
                        message: {
                          msgBody: "Load tài khoản không thành công",
                          msgError: true,
                        },
                        err,
                      });
                    } else {
                      res.status(200).json({
                        success: true,
                        message: {
                          msgBody: "Load tài khoản thành công",
                          msgError: false,
                        },
                        result,
                        totalAccount,
                      });
                    }
                  }
                );
              }
            });
        } else if (req.user.role === "admin") {
          Account.find(
            {
              _id: { $ne: _id },
              $nor: [{ role: "spadmin" }, { role: "admin" }],
            },
            { password: 0 }
          )
            .skip(skip)
            .limit(pageSize)
            .sort({ createdAt: -1, updatedAt: -1 })
            .exec((err, result) => {
              if (err) {
                res.status(404).json({
                  success: false,
                  message: {
                    msgBody: "Không tìm thấy dữ liệu",
                    msgError: true,
                  },
                  err,
                });
                return;
              } else {
                Account.countDocuments(
                  {
                    _id: { $ne: _id },
                    $nor: [{ role: "spadmin" }, { role: "admin" }],
                  },
                  (err, totalAccount) => {
                    if (err) {
                      res.status(400).json({
                        success: false,
                        message: {
                          msgBody: "Load tài khoản không thành công",
                          msgError: true,
                        },
                        err,
                      });
                    } else {
                      res.status(200).json({
                        success: true,
                        message: {
                          msgBody: "Load tài khoản thành công",
                          msgError: false,
                        },
                        result,
                        totalAccount,
                      });
                    }
                  }
                );
              }
            });
        }
      } else {
        if (req.user.role === "spadmin") {
          Account.find({ _id: { $ne: _id } }, { password: 0 })
            .skip(0)
            .limit(pageSize)
            .sort({ createdAt: -1, updatedAt: -1 })
            .exec((err, result) => {
              if (err) {
                res.status(404).json({
                  success: false,
                  message: {
                    msgBody: "Không tìm thấy dữ liệu",
                    msgError: true,
                  },
                  err,
                });
                return;
              } else {
                Account.countDocuments(
                  { _id: { $ne: _id } },
                  (err, totalAccount) => {
                    if (err) {
                      res.status(400).json({
                        success: false,
                        message: {
                          msgBody: "Load tài khoản không thành công",
                          msgError: true,
                        },
                        err,
                      });
                    } else {
                      res.status(200).json({
                        success: true,
                        message: {
                          msgBody: "Load tài khoản thành công",
                          msgError: false,
                        },
                        result,
                        totalAccount,
                      });
                    }
                  }
                );
              }
            });
        } else if (req.user.role === "admin") {
          Account.find(
            {
              _id: { $ne: _id },
              $nor: [{ role: "spadmin" }, { role: "admin" }],
            },
            { password: 0 }
          )
            .skip(0)
            .limit(pageSize)
            .sort({ createdAt: -1, updatedAt: -1 })
            .exec((err, result) => {
              if (err) {
                res.status(404).json({
                  success: false,
                  message: {
                    msgBody: "Không tìm thấy dữ liệu",
                    msgError: true,
                  },
                  err,
                });
                return;
              } else {
                Account.countDocuments(
                  {
                    _id: { $ne: _id },
                    $nor: [{ role: "spadmin" }, { role: "admin" }],
                  },
                  (err, totalAccount) => {
                    if (err) {
                      res.status(400).json({
                        success: false,
                        message: {
                          msgBody: "Load tài khoản không thành công",
                          msgError: true,
                        },
                        err,
                      });
                    } else {
                      res.status(200).json({
                        success: true,
                        message: {
                          msgBody: "Load tài khoản thành công",
                          msgError: false,
                        },
                        result,
                        totalAccount,
                      });
                    }
                  }
                );
              }
            });
        }
      }
    } else {
      res.status(404).json({
        message: {
          msgBody: "Không Có Quyền Truy Cập",
          msgError: false,
        },
      });
      return;
    }
  }
);

adminRouter.get(
  "/getAccountAll",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { role, _id } = req.user;
    if (role === "spadmin" || role === "admin") {
      if (role === "spadmin") {
        Account.find({ _id: { $ne: _id } }, { password: 0 }, (err, result) => {
          if (err) {
            res.status(404).json({
              success: false,
              message: {
                msgBody: "Không tìm được dữ liệu",
                msgError: true,
              },
              err,
            });
            return;
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
        }).sort({ createdAt: -1, updatedAt: -1 });
      } else if (role === "admin") {
        Account.find(
          {
            _id: { $ne: _id },
            $nor: [{ role: "spadmin" }, { role: "admin" }],
          },
          { password: 0 },
          (err, result) => {
            if (err) {
              res.status(404).json({
                success: false,
                message: {
                  msgBody: "Không tìm được dữ liệu",
                  msgError: true,
                },
                err,
              });
              return;
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
          }
        ).sort({ createdAt: -1, updatedAt: -1 });
      }
    } else {
      res.status(400).json({
        message: {
          msgBody: "Không quyền truy cập",
          msgError: true,
        },
      });
    }
  }
);

adminRouter.post(
  "/updateStatusAcc",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { _id, statusAcc } = req.body;
    const { role, status } = req.user;
    if (role === "spadmin" || role === "admin") {
      if (role === "spadmin") {
        Account.updateOne(
          { _id: _id },
          { status: statusAcc },
          (err, result) => {
            if (err) {
              res.status(400).json({
                success: false,
                message: {
                  msgBody: "Cập nhật status không thành công",
                  msgError: true,
                },
                err,
              });
            } else {
              res.status(200).json({
                success: true,
                message: {
                  msgBody: "Cập nhật status thành công",
                  msgError: false,
                },
                result,
              });
            }
          }
        );
      }
      if (role === "admin" && status) {
        Account.updateOne(
          { _id: _id, $nor: [{ role: "spadmin" }, { role: "admin" }] },
          { status: statusAcc },
          (err, result) => {
            if (err) {
              res.status(400).json({
                success: false,
                message: {
                  msgBody: "Cập nhật status không thành công",
                  msgError: true,
                },
                err,
              });
            } else if (result.nModified === 0) {
              res.status(204).json({
                success: false,
                message: {
                  msgBody: "Cập nhật status không thành công",
                  msgError: true,
                },
              });
            } else {
              res.status(200).json({
                success: true,
                message: {
                  msgBody: "Cập nhật status thành công",
                  msgError: false,
                },
                result,
              });
            }
          }
        );
      }
      if (role === "admin" && !status) {
        res.status(202).json({
          success: false,
          message: {
            msgBody: "Tài khoản admin này đang bị khoá",
            msgError: false,
          },
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: {
          msgBody: "Không có quyền truy cập",
          msgError: true,
        },
      });
    }
  }
);

adminRouter.get(
  "/getRecruitmentTrue",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { role } = req.user;
    if (role === "spadmin" || role === "admin") {
      const pageSize = 2;
      var page = req.query.page;
      if (page) {
        if (page < 1 || page === 0) {
          page = 1;
        }
        page = parseInt(page);
        var skip = (page - 1) * pageSize;
        Recruitment.find({ status: true })
          .sort({ createdAt: -1, updatedAt: -1 })
          .populate("city")
          .populate("career")
          .populate("writer", "username")
          .skip(skip)
          .limit(2)
          .exec((err, rcm) => {
            if (err) {
              res.status(400).json({
                success: false,
                message: {
                  msgBody: "Load danh sách công việc không thành công",
                  msgError: false,
                },
                err,
              });
            } else {
              Recruitment.countDocuments(
                { status: true },
                (err, totalRecruitmentTrue) => {
                  if (err) {
                    res.status(400).json({
                      success: false,
                      message: {
                        msgBody: "Lỗi",
                        msgError: true,
                      },
                      err,
                    });
                  } else {
                    res.status(200).json({
                      success: true,
                      message: {
                        msgBody: "Load danh sách công việc thành công",
                        msgError: false,
                      },
                      rcm,
                      totalRecruitmentTrue,
                    });
                  }
                }
              );
            }
          });
      } else {
        Recruitment.find({ status: true })
          .sort({ createdAt: -1, updatedAt: -1 })
          .populate("city")
          .populate("career")
          .populate("writer", "username")
          .exec((err, rcm) => {
            if (err) {
              res.status(400).json({
                success: false,
                message: {
                  msgBody: "Load danh sách công việc không thành công",
                  msgError: false,
                },
                err,
              });
            } else {
              Recruitment.countDocuments(
                { status: true },
                (err, totalRecruitmentTrue) => {
                  if (err) {
                    res.status(400).json({
                      success: false,
                      message: {
                        msgBody: "Lỗi",
                        msgError: true,
                      },
                      err,
                    });
                  } else {
                    res.status(200).json({
                      success: true,
                      message: {
                        msgBody: "Load danh sách công việc thành công",
                        msgError: false,
                      },
                      rcm,
                      totalRecruitmentTrue,
                    });
                  }
                }
              );
            }
          });
      }
    } else {
      res.status(400).json({
        success: false,
        message: {
          msgBody: "Không có quyền truy cập",
          msgError: true,
        },
      });
    }
  }
);

adminRouter.get(
  "/getRecruitmentFalse",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { role } = req.user;
    if (role === "spadmin" || role === "admin") {
      const pageSize = 2;
      var page = req.query.page;
      if (page) {
        if (page < 1 || page === 0) {
          page = 1;
        }
        page = parseInt(page);
        var skip = (page - 1) * pageSize;
        Recruitment.find({ status: false })
          .sort({ createdAt: 1, updatedAt: 1 })
          .populate("city")
          .populate("career")
          .populate("writer", "username")
          .skip(skip)
          .limit(2)
          .exec((err, rcm) => {
            if (err) {
              res.status(400).json({
                success: false,
                message: {
                  msgBody: "Load danh sách công việc không thành công",
                  msgError: false,
                },
                err,
              });
            } else {
              Recruitment.countDocuments(
                { status: false },
                (err, totalRecruitmentFalse) => {
                  if (err) {
                    res.status(400).json({
                      success: false,
                      message: {
                        msgBody: "Lỗi",
                        msgError: true,
                      },
                      err,
                    });
                  } else {
                    res.status(200).json({
                      success: true,
                      message: {
                        msgBody: "Load danh sách công việc thành công",
                        msgError: false,
                      },
                      rcm,
                      totalRecruitmentFalse,
                    });
                  }
                }
              );
            }
          });
      } else {
        Recruitment.find({ status: false })
          .sort({ createdAt: 1, updatedAt: 1 })
          .populate("city")
          .populate("career")
          .populate("writer", "username")
          .skip(0)
          .limit(2)
          .exec((err, rcm) => {
            if (err) {
              res.status(400).json({
                success: false,
                message: {
                  msgBody: "Load danh sách công việc không thành công",
                  msgError: false,
                },
                err,
              });
            } else {
              Recruitment.countDocuments(
                { status: false },
                (err, totalRecruitmentFalse) => {
                  if (err) {
                    res.status(400).json({
                      success: false,
                      message: {
                        msgBody: "Lỗi",
                        msgError: true,
                      },
                      err,
                    });
                  } else {
                    res.status(200).json({
                      success: true,
                      message: {
                        msgBody: "Load danh sách công việc thành công",
                        msgError: false,
                      },
                      rcm,
                      totalRecruitmentFalse,
                    });
                  }
                }
              );
            }
          });
      }
    } else {
      res.status(400).json({
        success: false,
        message: {
          msgBody: "Không có quyền truy cập",
          msgError: true,
        },
      });
    }
  }
);

adminRouter.post(
  "/updateStatusRecruitment",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { _id, statusRcm } = req.body;
    const { role, status } = req.user;
    if (role === "spadmin" || role === "admin") {
      if (role === "spadmin") {
        Recruitment.updateOne(
          { _id: _id },
          { status: statusRcm },
          (err, result) => {
            if (err) {
              res.status(400).json({
                success: false,
                message: {
                  msgBody: "Cập nhật status không thành công",
                  msgError: true,
                },
                err,
              });
            } else {
              res.status(200).json({
                success: true,
                message: {
                  msgBody: "Cập nhật status thành công",
                  msgError: false,
                },
                result,
              });
            }
          }
        );
      }
      if (role === "admin" && status) {
        Recruitment.updateOne(
          { _id: _id },
          { status: statusRcm },
          (err, result) => {
            if (err) {
              res.status(400).json({
                success: false,
                message: {
                  msgBody: "Cập nhật status không thành công",
                  msgError: true,
                },
                err,
              });
            } else if (result.nModified === 0) {
              res.status(204).json({
                success: false,
                message: {
                  msgBody: "Cập nhật status không thành công",
                  msgError: true,
                },
              });
            } else {
              res.status(200).json({
                success: true,
                message: {
                  msgBody: "Cập nhật status thành công",
                  msgError: false,
                },
                result,
              });
            }
          }
        );
      }
      if (role === "admin" && !status) {
        res.status(202).json({
          success: false,
          message: {
            msgBody: "Tài khoản admin này đang bị khoá",
            msgError: false,
          },
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: {
          msgBody: "Không có quyền truy cập",
          msgError: true,
        },
      });
    }
  }
);

adminRouter.post(
  "/addAccountAdmin",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const roleSpadmin = req.user.role;
    if (roleSpadmin === "spadmin") {
      const { email, username } = req.body;
      const password = "123456";
      const role = "admin";
      Account.findOne(
        { $or: [{ username: username }, { email: email }] },
        (err, user) => {
          if (err)
            res.status(400).json({
              message: {
                msgBody: "Có lỗi khi tìm kiếm với CSDL",
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
          } else if (role === "spadmin") {
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
                res.status(400).json({
                  message: {
                    msgBody: "Có lỗi khi thêm tài khoản vào CSDL 2",
                    msgError: true,
                    err,
                  },
                });
              else
                res.status(200).json({
                  message: {
                    msgBody: "Tạo tại khoản thành công",
                    msgError: false,
                  },
                });
            });
          }
        }
      );
    } else {
      res.status(400).json({
        success: false,
        message: {
          msgBody: "Không có quyền truy cập",
          msgError: true,
        },
      });
    }
  }
);

adminRouter.post(
  "/searchAcc",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { _id } = req.user;
    const { searchTerm } = req.body;
    Account.find(
      { username: { $regex: searchTerm, $options: "$i" }, _id: { $ne: _id } },
      { password: 0 },
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
        } else {
          Account.countDocuments(
            {
              username: { $regex: searchTerm, $options: "$i" },
              _id: { $ne: _id },
            },
            (err, total) => {
              if (err) {
                res.status(400).json({
                  success: false,
                  message: {
                    msgBody: "Lỗi!!!",
                    msgError: true,
                  },
                });
              }
              if (total < 1) {
                res.status(203).json({
                  success: false,
                  message: {
                    msgBody: "Tài khoản không tồn tại",
                    msgError: true,
                  },
                  result,
                  total,
                });
              } else {
                res.status(200).json({
                  success: true,
                  message: {
                    msgBody: "Load dữ liệu thành công",
                    msgError: false,
                  },
                  result,
                  total,
                });
              }
            }
          );
        }
      }
    ).sort({ createdAt: -1 });
  }
);

module.exports = adminRouter;

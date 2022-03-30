const express = require("express");
const passport = require("passport");
const City = require("../models/City");
const Recruitment = require("../models/Recruitment");
const Career = require("../models/Career");
const recruitmentRouter = express.Router();
const multer = require("multer");
const fs = require("fs");

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const path = require("path");
    const ext = path.extname(file.originalname);
    if (
      ext !== ".png" &&
      ext !== ".PNG" &&
      ext !== ".jpg" &&
      ext !== ".JPG" &&
      ext !== ".jpeg" &&
      ext !== ".svg" &&
      ext !== ".SVG" &&
      ext !== ".mp4"
    ) {
      return cb(new Error("Lỗi rồi"));
    }
    cb(null, true);
  },
}).single("file");

recruitmentRouter.post(
  "/uploadfiles",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    upload(req, res, (err) => {
      if (err) {
        return res.status(201).json({
          success: false,
          message: {
            msgBody: "Upload lỗi!!! không hổ trợ định dạng này",
            msgError: true,
          },
        });
      }
      return res.json({
        success: true,
        message: {
          msgBody: "Upload thành công!!!",
          msgError: false,
        },
        url: res.req.file.path,
        fileName: res.req.file.filename,
      });
    });
  }
);

recruitmentRouter.post(
  "/deleteImageUpload",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { file } = req.body;
    fs.unlink(`${file}`, (err, result) => {
      if (err) {
        res.status(404).json({
          success: false,
          message: {
            msgBody: "Xoá image không thành công!!!",
            msgError: true,
          },
          err,
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: {
          msgBody: "Xoá image thành công!!!",
          msgError: false,
        },
        result,
      });
    });
  }
);

recruitmentRouter.post(
  "/createRecruitment",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const {
      email,
      sdt,
      contact,
      salary,
      title,
      description,
      city,
      career,
    } = req.body;

    const img =
      req.body.img || req.body.img.length >= 1
        ? req.body.img
        : ["uploads\\tuyen-dung.png"];

    const writer = req.user._id;
    const { status } = req.user;
    if (status) {
      Recruitment.find({ writer: writer, status: false }, (err, result) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: {
              msgBody: "Lôi!!!",
              msgError: true,
            },
            err,
          });
        }
        if (result.length >= 1) {
          res.status(203).json({
            success: false,
            message: {
              msgBody:
                "Tài Khoản Này Có Bài Viết Chưa Được Phê Duyệt. Vui Lòng Chờ Quá Trình Phê Duyệt Hoàn Tất",
              msgError: true,
            },
          });
        } else {
          const newRrm = new Recruitment({
            email,
            sdt,
            contact,
            salary,
            title,
            img,
            description,
            writer,
            city,
            career,
          });
          newRrm.save((err, result) => {
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
              City.updateOne(
                { _id: city },
                { $push: { recruitments: newRrm } },
                (err, cpl) => {
                  if (err) {
                    res.status(400).json({
                      message: {
                        msgBody: "Có lỗi thành phố không tồn tại",
                        msgError: true,
                      },
                    });
                  }
                }
              );
              Career.updateOne(
                { _id: career },
                { $push: { recruitments: newRrm } },
                (err, cpl) => {
                  if (err) {
                    res.status(400).json({
                      message: {
                        msgBody: "Có lỗi ngành nghề không tồn tại",
                        msgError: true,
                      },
                    });
                  }
                }
              );
              return res.status(200).json({
                message: {
                  msgBody: "Thêm dữ liệu thành công",
                  msgError: false,
                },
                result,
              });
            }
          });
        }
      });
    } else {
      res.status(203).json({
        success: false,
        message: {
          msgBody: "Tài Khoản Này Đã Bị Khoá",
          msgError: true,
        },
      });
    }
  }
);

recruitmentRouter.post("/getRecruitment", (req, res) => {
  const skip = req.body.skip ? req.body.skip : 0;
  Recruitment.find({ status: true })
    .sort({ createdAt: -1, updatedAt: -1 })
    .skip(skip)
    .limit(3)
    .populate("city", "name")
    .populate("career", "name")
    .exec((err, rcm) => {
      if (err) {
        res.status(400).json({
          message: {
            msgBody: "Load danh sách công việc không thành công",
            msgError: false,
          },
          err,
        });
      } else {
        Recruitment.countDocuments({ status: true }, (err, total) => {
          if (err) {
            res.status(400).json({
              message: {
                msgBody: "Load danh sách công việc không thành công",
                msgError: false,
              },
              err,
            });
          } else {
            res.status(200).json({
              message: {
                msgBody: "Load danh sách công việc thành công",
                msgError: false,
              },
              rcm,
              total,
            });
          }
        });
      }
    });
});

recruitmentRouter.get(
  "/getMyRecruitment",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const pageSize = 2;
    var page = req.query.page;
    if (page) {
      if (page < 1 || page === 0) {
        page = 1;
      }
      page = parseInt(page);
      var skip = (page - 1) * pageSize;
      const writer = req.user._id;
      Recruitment.find(
        { writer: writer },
        {},
        { sort: { createdAt: -1 }, skip: skip, limit: 2 }
      ).exec((err, result) => {
        if (err) {
          res.status(404).json({
            message: {
              msgBody: "Có Lỗi",
              msgError: true,
            },
            err,
          });
          return;
        } else {
          Recruitment.countDocuments(
            { writer: writer },
            (err, totalMyRecruitment) => {
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
                    msgBody: "Load Thành Công",
                    msgError: false,
                  },
                  result,
                  totalMyRecruitment,
                });
              }
            }
          );
        }
      });
    } else {
      const writer = req.user._id;
      Recruitment.find({ writer: writer })
        .skip(0)
        .limit(2)
        .sort({ createdAt: -1 })
        .exec((err, result) => {
          if (err) {
            res.status(404).json({
              success: false,
              message: {
                msgBody: "Có Lỗi",
                msgError: true,
              },
              err,
            });
            return;
          } else {
            Recruitment.countDocuments(
              { writer: writer },
              (err, totalMyRecruitment) => {
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
                      msgBody: "Load Thành Công",
                      msgError: false,
                    },
                    result,
                    totalMyRecruitment,
                  });
                }
              }
            );
          }
        });
    }
  }
);

recruitmentRouter.get("/getFavouriteRecruitment", (req, res) => {
  Recruitment.aggregate(
    [
      {
        $lookup: {
          from: "cities",
          localField: "_id",
          foreignField: "recruitments",
          as: "city",
        },
      },
      {
        $lookup: {
          from: "careers",
          localField: "_id",
          foreignField: "recruitments",
          as: "career",
        },
      },
      { $unwind: "$city" },
      { $unwind: "$career" },
      {
        $project: {
          city: "$city",
          career: "$career",
          status: 1,
          img: 1,
          cv: 1,
          email: 1,
          sdt: 1,
          contact: 1,
          salary: 1,
          title: 1,
          description: 1,
          writer: 1,
          createdAt: 1,
          updatedAt: 1,
          favourite: { $size: { $ifNull: ["$cv", []] } },
        },
      },
      { $match: { status: true } },
      {
        $sort: { favourite: -1, createdAt: -1 },
      },
      { $limit: 6 },
    ],
    (err, rcm) => {
      if (err) {
        res.status(404).json({
          success: false,
          message: {
            msgBody: "Không có dữ liệu",
            msgError: true,
          },
          err,
        });
        return;
      } else {
        res.status(200).json({
          success: true,
          message: {
            msgBody: "Load tin tuyển dụng thành công",
            msgError: false,
          },
          rcm,
        });
      }
    }
  );
});

recruitmentRouter.post("/getRecruitmentById", (req, res) => {
  const { idcity, idcareer } = req.body;
  Recruitment.find({
    $or: [
      { city: idcity, status: true },
      { career: idcareer, status: true },
    ],
  })
    .populate("city", "name")
    .populate("career", "name")
    .exec((err, rcm) => {
      if (err) {
        res.status(404).json({
          success: false,
          message: {
            msgBody: "Không có dữ liệu",
            msgError: true,
          },
          err,
        });
        return;
      } else {
        Recruitment.countDocuments(
          {
            $or: [
              { city: idcity, status: true },
              { career: idcareer, status: true },
            ],
          },
          (err, total) => {
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
            if (total < 1) {
              res.status(203).json({
                success: false,
                message: {
                  msgBody: "Tin tuyển dụng không tồn tại",
                  msgError: true,
                },
                rcm,
                total,
              });
            } else {
              res.status(200).json({
                success: true,
                message: {
                  msgBody: "Load dữ liệu thành công",
                  msgError: false,
                },
                rcm,
                total,
              });
            }
          }
        );
      }
    });
});

recruitmentRouter.post("/getRecruitmentByIdLoadMore", (req, res) => {
  const { idcity, idcareer } = req.body;
  const skip = req.body.skip ? req.body.skip : 0;
  Recruitment.find({
    $or: [
      { city: idcity, status: true },
      { career: idcareer, status: true },
    ],
  })
    .populate("city", "name")
    .populate("career", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(3)
    .exec((err, rcm) => {
      if (err) {
        res.status(404).json({
          success: false,
          message: {
            msgBody: "Không có dữ liệu",
            msgError: true,
          },
          err,
        });
        return;
      } else {
        Recruitment.countDocuments(
          {
            $or: [
              { city: idcity, status: true },
              { career: idcareer, status: true },
            ],
          },
          (err, total) => {
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
            if (total < 1) {
              res.status(203).json({
                success: true,
                emty: true,
                message: {
                  msgBody: "Chưa Có Tin Tuyển Dụng",
                  msgError: true,
                },
                rcm,
                total,
              });
            } else {
              res.status(200).json({
                success: true,
                emty: false,
                message: {
                  msgBody: "Load dữ liệu thành công",
                  msgError: false,
                },
                rcm,
                total,
              });
            }
          }
        );
      }
    });
});

recruitmentRouter.get("/getRecruitmentByIdFalse", (req, res) => {
  const { idcity, idcareer } = req.body;
  Recruitment.find({
    $or: [
      { city: idcity, status: false },
      { career: idcareer, status: false },
    ],
  })
    .populate("city")
    .populate("career")
    .exec((err, rcm) => {
      if (err) {
        res.status(404).json({
          success: false,
          message: {
            msgBody: "Không có dữ liệu",
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
          rcm,
        });
      }
    });
});

recruitmentRouter.get("/:id", (req, res) => {
  Recruitment.findById(req.params.id)
    .populate("writer", "_id username role")
    .populate("city", "name _id")
    .populate("career", "name _id")
    .exec((err, rcm) => {
      if (err) {
        res.status(404).json({
          success: false,
          message: {
            msgBody: "Lấy dữ liệu không thành công",
            msgError: true,
          },
        });
        return;
      }
      if (!rcm || rcm.length < 1) {
        return res.status(404).json({
          success: false,
          message: {
            msgBody: "Dữ liệu không tồn tại",
            msgError: true,
          },
          rcm,
        });
      } else {
        return res.status(200).json({
          success: true,
          message: {
            msgBody: "Lấy dữ liệu thành công",
            msgError: false,
          },
          rcm,
        });
      }
    });
});

recruitmentRouter.post(
  "/getDetailRecruitment",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role === "admin" || req.user.role === "spadmin") {
      Recruitment.findOne({ _id: req.body._id })
        .populate("writer", "_id username role")
        .populate("city")
        .populate("career")
        .exec((err, rcm) => {
          if (err) return res.status(400).json(err);
          res.status(200).json({ success: true, rcm });
        });
    } else {
      Recruitment.findOne({ _id: req.body._id, writer: req.body.writer })
        .populate("writer", "_id username role")
        .populate("city")
        .populate("career")
        .exec((err, rcm) => {
          if (err) return res.status(400).json(err);
          res.status(200).json({ success: true, rcm });
        });
    }
  }
);

recruitmentRouter.post(
  "/updateRecruitment",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const item = {
      email: req.body.email,
      sdt: req.body.sdt,
      contact: req.body.contact,
      salary: req.body.salary,
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      city: req.body.city,
      career: req.body.career,
      status: false,
    };

    const updates = item;
    const options = { new: true };

    const { _id } = req.body;

    const { role } = req.user;
    const writer = req.user._id;

    if (role === "spadmin" || role === "admin") {
      Recruitment.findOne({ _id: _id }).exec((err, recruitment) => {
        if (err || !recruitment) {
          res.status(404).json({
            message: {
              msgBody: "Không có dữ liệu",
              msgError: true,
            },
          });
          return;
        } else {
          if (
            String(recruitment.city) === item.city &&
            String(recruitment.career) === item.career
          ) {
            Recruitment.findByIdAndUpdate(_id, updates, options)
              .then((result) => {
                res.status(200).json({
                  success: true,
                  message: {
                    msgBody: "Cập nhật tuyển dụng thành công",
                    msgError: false,
                  },
                });
              })
              .catch((err) => {
                res.status(400).json({
                  success: true,
                  message: {
                    msgBody: "Cập nhật tuyển dụng không thành công",
                    msgError: false,
                  },
                });
                return;
              });
          }
          if (
            String(recruitment.city) !== item.city &&
            String(recruitment.career) === item.career
          ) {
            Recruitment.findByIdAndUpdate(_id, updates, options).exec(
              (err, result) => {
                if (err) {
                  res.status(400).json({
                    success: true,
                    message: {
                      msgBody: "Cập nhật tuyển dụng không thành công",
                      msgError: false,
                    },
                  });
                  return;
                } else {
                  City.updateOne(
                    { _id: String(recruitment.city) },
                    { $pull: { recruitments: _id } },
                    (err, cpl) => {
                      if (err) {
                        res.status(404).json({
                          message: {
                            msgBody: "Có lỗi thành phố không tồn tại",
                            msgError: true,
                          },
                        });
                        return;
                      }
                    }
                  );
                  City.updateOne(
                    { _id: item.city },
                    { $push: { recruitments: _id } },
                    (err, cpl) => {
                      if (err) {
                        res.status(404).json({
                          message: {
                            msgBody: "Có lỗi thành phố không tồn tại",
                            msgError: true,
                          },
                        });
                        return;
                      }
                    }
                  );
                  return res.status(200).json({
                    success: true,
                    message: {
                      msgBody: "Cập nhật tuyển dụng thành công",
                      msgError: false,
                    },
                  });
                }
              }
            );
          }
          if (
            String(recruitment.career) !== item.career &&
            String(recruitment.city) === item.city
          ) {
            Recruitment.findByIdAndUpdate(_id, updates, options).exec(
              (err, result) => {
                if (err) {
                  res.status(400).json({
                    success: true,
                    message: {
                      msgBody: "Cập nhật tuyển dụng không thành công",
                      msgError: false,
                    },
                  });
                  return;
                } else {
                  Career.updateOne(
                    { _id: String(recruitment.career) },
                    { $pull: { recruitments: _id } },
                    (err, cpl) => {
                      if (err) {
                        res.status(404).json({
                          message: {
                            msgBody: "Có lỗi ngành nghề không tồn tại",
                            msgError: true,
                          },
                        });
                        return;
                      }
                    }
                  );
                  Career.updateOne(
                    { _id: item.career },
                    { $push: { recruitments: _id } },
                    (err, cpl) => {
                      if (err) {
                        res.status(404).json({
                          message: {
                            msgBody: "Có lỗi ngành nghề không tồn tại",
                            msgError: true,
                          },
                        });
                        return;
                      }
                    }
                  );
                  return res.status(200).json({
                    success: true,
                    message: {
                      msgBody: "Cập nhật tuyển dụng thành công",
                      msgError: false,
                    },
                  });
                }
              }
            );
          }
          if (
            String(recruitment.city) !== item.city &&
            String(recruitment.career) !== item.career
          ) {
            Recruitment.findByIdAndUpdate(_id, updates, options).exec(
              (err, result) => {
                if (err) {
                  res.status(400).json({
                    success: true,
                    message: {
                      msgBody: "Cập nhật tuyển dụng không thành công",
                      msgError: false,
                    },
                  });
                  return;
                } else {
                  City.updateOne(
                    { _id: String(recruitment.city) },
                    { $pull: { recruitments: _id } },
                    (err, cpl) => {
                      if (err) {
                        res.status(404).json({
                          message: {
                            msgBody: "Có lỗi thành phố không tồn tại",
                            msgError: true,
                          },
                        });
                        return;
                      }
                    }
                  );
                  City.updateOne(
                    { _id: item.city },
                    { $push: { recruitments: _id } },
                    (err, cpl) => {
                      if (err) {
                        res.status(404).json({
                          message: {
                            msgBody: "Có lỗi thành phố không tồn tại",
                            msgError: true,
                          },
                        });
                        return;
                      }
                    }
                  );
                  Career.updateOne(
                    { _id: String(recruitment.career) },
                    { $pull: { recruitments: _id } },
                    (err, cpl) => {
                      if (err) {
                        res.status(404).json({
                          message: {
                            msgBody: "Có lỗi ngành nghề không tồn tại",
                            msgError: true,
                          },
                        });
                        return;
                      }
                    }
                  );
                  Career.updateOne(
                    { _id: item.career },
                    { $push: { recruitments: _id } },
                    (err, cpl) => {
                      if (err) {
                        res.status(404).json({
                          message: {
                            msgBody: "Có lỗi ngành nghề không tồn tại",
                            msgError: true,
                          },
                        });
                        return;
                      }
                    }
                  );
                  return res.status(200).json({
                    success: true,
                    message: {
                      msgBody: "Cập nhật tuyển dụng thành công",
                      msgError: false,
                    },
                  });
                }
              }
            );
          }
        }
      });
    }
    if (role === "recruiter") {
      Recruitment.findOne({ _id: _id, writer: writer }).exec(
        (err, recruitment) => {
          if (err || !recruitment) {
            res.status(404).json({
              message: {
                msgBody: "Không có dữ liệu",
                msgError: true,
              },
            });
            return;
          } else {
            if (
              String(recruitment.city) === item.city &&
              String(recruitment.career) === item.career
            ) {
              Recruitment.findByIdAndUpdate(_id, updates, options)
                .then((result) => {
                  res.status(200).json({
                    success: true,
                    message: {
                      msgBody: "Cập nhật tuyển dụng thành công",
                      msgError: false,
                    },
                  });
                })
                .catch((err) => {
                  res.status(400).json({
                    success: true,
                    message: {
                      msgBody: "Cập nhật tuyển dụng không thành công",
                      msgError: false,
                    },
                  });
                  return;
                });
            }
            if (
              String(recruitment.city) !== item.city &&
              String(recruitment.career) === item.career
            ) {
              Recruitment.findByIdAndUpdate(_id, updates, options).exec(
                (err, result) => {
                  if (err) {
                    res.status(400).json({
                      success: true,
                      message: {
                        msgBody: "Cập nhật tuyển dụng không thành công",
                        msgError: false,
                      },
                    });
                    return;
                  } else {
                    City.updateOne(
                      { _id: String(recruitment.city) },
                      { $pull: { recruitments: _id } },
                      (err, cpl) => {
                        if (err) {
                          res.status(404).json({
                            message: {
                              msgBody: "Có lỗi thành phố không tồn tại",
                              msgError: true,
                            },
                          });
                          return;
                        }
                      }
                    );
                    City.updateOne(
                      { _id: item.city },
                      { $push: { recruitments: _id } },
                      (err, cpl) => {
                        if (err) {
                          res.status(404).json({
                            message: {
                              msgBody: "Có lỗi thành phố không tồn tại",
                              msgError: true,
                            },
                          });
                          return;
                        }
                      }
                    );
                    return res.status(200).json({
                      success: true,
                      message: {
                        msgBody: "Cập nhật tuyển dụng thành công",
                        msgError: false,
                      },
                    });
                  }
                }
              );
            }
            if (
              String(recruitment.career) !== item.career &&
              String(recruitment.city) === item.city
            ) {
              Recruitment.findByIdAndUpdate(_id, updates, options).exec(
                (err, result) => {
                  if (err) {
                    res.status(400).json({
                      success: true,
                      message: {
                        msgBody: "Cập nhật tuyển dụng không thành công",
                        msgError: false,
                      },
                    });
                    return;
                  } else {
                    Career.updateOne(
                      { _id: String(recruitment.career) },
                      { $pull: { recruitments: _id } },
                      (err, cpl) => {
                        if (err) {
                          res.status(404).json({
                            message: {
                              msgBody: "Có lỗi ngành nghề không tồn tại",
                              msgError: true,
                            },
                          });
                          return;
                        }
                      }
                    );
                    Career.updateOne(
                      { _id: item.career },
                      { $push: { recruitments: _id } },
                      (err, cpl) => {
                        if (err) {
                          res.status(404).json({
                            message: {
                              msgBody: "Có lỗi ngành nghề không tồn tại",
                              msgError: true,
                            },
                          });
                          return;
                        }
                      }
                    );
                    return res.status(200).json({
                      success: true,
                      message: {
                        msgBody: "Cập nhật tuyển dụng thành công",
                        msgError: false,
                      },
                    });
                  }
                }
              );
            }
            if (
              String(recruitment.city) !== item.city &&
              String(recruitment.career) !== item.career
            ) {
              Recruitment.findByIdAndUpdate(_id, updates, options).exec(
                (err, result) => {
                  if (err) {
                    res.status(400).json({
                      success: true,
                      message: {
                        msgBody: "Cập nhật tuyển dụng không thành công",
                        msgError: false,
                      },
                    });
                    return;
                  } else {
                    City.updateOne(
                      { _id: String(recruitment.city) },
                      { $pull: { recruitments: _id } },
                      (err, cpl) => {
                        if (err) {
                          res.status(404).json({
                            message: {
                              msgBody: "Có lỗi thành phố không tồn tại",
                              msgError: true,
                            },
                          });
                          return;
                        }
                      }
                    );
                    City.updateOne(
                      { _id: item.city },
                      { $push: { recruitments: _id } },
                      (err, cpl) => {
                        if (err) {
                          res.status(404).json({
                            message: {
                              msgBody: "Có lỗi thành phố không tồn tại",
                              msgError: true,
                            },
                          });
                          return;
                        }
                      }
                    );
                    Career.updateOne(
                      { _id: String(recruitment.career) },
                      { $pull: { recruitments: _id } },
                      (err, cpl) => {
                        if (err) {
                          res.status(404).json({
                            message: {
                              msgBody: "Có lỗi ngành nghề không tồn tại",
                              msgError: true,
                            },
                          });
                          return;
                        }
                      }
                    );
                    Career.updateOne(
                      { _id: item.career },
                      { $push: { recruitments: _id } },
                      (err, cpl) => {
                        if (err) {
                          res.status(404).json({
                            message: {
                              msgBody: "Có lỗi ngành nghề không tồn tại",
                              msgError: true,
                            },
                          });
                          return;
                        }
                      }
                    );
                    return res.status(200).json({
                      success: true,
                      message: {
                        msgBody: "Cập nhật tuyển dụng thành công",
                        msgError: false,
                      },
                    });
                  }
                }
              );
            }
          }
        }
      );
    } else {
      return res.status(203).json({
        success: false,
        message: {
          msgBody: "Tài khoản không có quyền đăng tin",
          msgError: true,
        },
      });
    }
  }
);

recruitmentRouter.post(
  "/deleteRecruitment",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { _id, cityId, careerId } = req.body;

    const writer = req.user._id;
    if (req.user.role === "admin" || req.user.role === "spadmin") {
      Recruitment.findByIdAndDelete({ _id: _id }, (err, result) => {
        if (err) {
          res.status(500).json({
            message: {
              msgBody: "Có Lỗi!!!",
              msgError: true,
            },
            err,
          });
        }
        if (!result) {
          res.status(400).json({
            message: {
              msgBody: "Không có dữ liệu này",
              msgError: true,
            },
            result,
          });
        } else {
          for (let i = 0; i < result.img.length; i++) {
            if (
              result.img.length >= 1 &&
              result.img[0] !== "uploads\\tuyen-dung.png"
            ) {
              fs.unlink(`${result.img[i]}`, (err, remove) => {
                if (err) {
                  res.status(404).json({
                    success: false,
                    message: {
                      msgBody: "Xoá image không thành công!!!",
                      msgError: true,
                    },
                    err,
                  });
                  return;
                }
              });
            }
          }
          City.updateOne(
            { _id: cityId },
            { $pull: { recruitments: _id } },
            (err, cpl) => {
              if (err) {
                res.status(400).json({
                  message: {
                    msgBody: "Có lỗi thành phố không tồn tại",
                    msgError: true,
                  },
                  err,
                });
              }
            }
          );
          Career.updateOne(
            { _id: careerId },
            { $pull: { recruitments: _id } },
            (err, cpl) => {
              if (err) {
                res.status(400).json({
                  message: {
                    msgBody: "Có lỗi ngành nghề không tồn tại",
                    msgError: true,
                  },
                  err,
                });
              }
            }
          );
          return res.status(200).json({
            message: {
              msgBody: "Xoá thành công",
              msgError: false,
            },
            result,
          });
        }
      });
    } else {
      Recruitment.findOneAndRemove(
        { _id: _id, writer: writer },
        (err, result) => {
          if (err) {
            res.status(404).json({
              message: {
                msgBody: "Không Xoá Được",
                msgError: true,
              },
              err,
            });
            return;
          }
          if (!result) {
            res.status(400).json({
              message: {
                msgBody: "Không xoá được",
                msgError: true,
              },
              result,
            });
          } else {
            for (let i = 0; i < result.img.length; i++) {
              if (
                result.img.length >= 1 &&
                result.img[0] !== "uploads\\tuyen-dung.png"
              ) {
                fs.unlink(`${result.img[i]}`, (err, remove) => {
                  if (err) {
                    res.status(404).json({
                      success: false,
                      message: {
                        msgBody: "Xoá image không thành công!!!",
                        msgError: true,
                      },
                      err,
                    });
                    return;
                  }
                });
              }
            }
            City.updateOne(
              { _id: cityId },
              { $pull: { recruitments: _id } },
              (err, cpl) => {
                if (err) {
                  res.status(400).json({
                    message: {
                      msgBody: "Có lỗi thành phố không tồn tại",
                      msgError: true,
                    },
                    err,
                  });
                }
              }
            );
            Career.updateOne(
              { _id: careerId },
              { $pull: { recruitments: _id } },
              (err, cpl) => {
                if (err) {
                  res.status(400).json({
                    message: {
                      msgBody: "Có lỗi ngành nghề không tồn tại",
                      msgError: true,
                    },
                    err,
                  });
                }
              }
            );
            return res.status(200).json({
              message: {
                msgBody: "Xoá thành công",
                msgError: false,
              },
              result,
            });
          }
        }
      );
    }
  }
);

recruitmentRouter.post("/searchRecruitment", (req, res) => {
  const { searchTerm } = req.body;
  const skip = req.body.skip ? req.body.skip : 0;
  Recruitment.find(
    { $text: { $search: searchTerm }, status: true },
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
        Recruitment.countDocuments(
          { $text: { $search: searchTerm }, status: true },
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
                exist: false,
                message: {
                  msgBody: "Tin tuyển dụng không tồn tại",
                  msgError: true,
                },
                result,
                total,
              });
            } else {
              res.status(200).json({
                success: true,
                exist: true,
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
  )
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(3);
});

module.exports = recruitmentRouter;

const express = require("express");
const passport = require("passport");
const Career = require("../models/Career");
const careerRouter = express.Router();

careerRouter.post(
  "/createCareer",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { name } = req.body;
    const { role, status } = req.user;

    const newCareer = new Career({
      name,
    });

    if (role === "spadmin" || role === "admin") {
      if (role === "spadmin") {
        newCareer.save((err, result) => {
          if (err) {
            res.status(400).json({
              success: false,
            });
          } else {
            res.status(200).json({
              success: true,
              result,
            });
          }
        });
      }
      if (role === "admin" && status) {
        newCareer.save((err, result) => {
          if (err) {
            res.status(400).json({
              success: false,
            });
          } else {
            res.status(200).json({
              success: true,
              result,
            });
          }
        });
      } else if (role === "admin" && !status) {
        res.status(400).json({
          success: false,
          message: {
            msgBody: "Tài khoản admin này đang bị khoá",
            msgError: true,
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

careerRouter.get("/getCareer", (req, res) => {
  Career.find((err, cv) => {
    if (err) {
      res.status(201).json({
        success: false,
        message: {
          msgBody: "Load công việc không thành công",
          msgError: true,
        },
        err,
      });
    }
    res.status(200).json({
      success: true,
      message: {
        msgBody: "Load công việc thành công",
        msgError: false,
      },
      cv,
    });
  });
});

careerRouter.post("/getCareerByID", (req, res) => {
  const { idcity, idcareer } = req.body;
  Career.findOne(
    {
      $or: [{ _id: idcity }, { _id: idcareer }],
    },
    (err, career) => {
      if (err) {
        res.status(404).json({
          success: false,
          message: {
            msgBody: "Load không thành công",
            msgError: true,
          },
          err,
        });
        return;
      } else {
        res.status(200).json({
          success: true,
          message: {
            msgBody: "Load thành công",
            msgError: false,
          },
          career,
        });
      }
    }
  );
});

module.exports = careerRouter;

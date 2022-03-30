const express = require("express");
const passport = require("passport");
const Career = require("../models/Career");
const City = require("../models/City");
const Recruitment = require("../models/Recruitment");
const cityRouter = express.Router();

cityRouter.post(
  "/createCity",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { name } = req.body;
    const { role, status } = req.user;

    const newCity = new City({
      name,
    });

    if (role === "spadmin" || role === "admin") {
      if (role === "spadmin") {
        newCity.save((err, result) => {
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
        newCity.save((err, result) => {
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

cityRouter.get("/getCity", (req, res) => {
  City.find((err, ct) => {
    if (err) {
      res.status(404).json({
        success: false,
        message: {
          msgBody: "Load thành phố không thành công",
          msgError: true,
        },
        err,
      });
      return;
    } else {
      res.status(200).json({
        success: true,
        message: {
          msgBody: "Load thành phố thành công",
          msgError: false,
        },
        ct,
      });
    }
  });
});

cityRouter.post("/getCityByID", (req, res) => {
  const { idcity, idcareer } = req.body;
  City.findOne(
    {
      $or: [{ _id: idcity }, { _id: idcareer }],
    },
    (err, ct) => {
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
          ct,
        });
      }
    }
  );
});

module.exports = cityRouter;

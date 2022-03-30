const mongoose = require("mongoose");

const RecruitmentSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    sdt: {
      type: String,
    },
    contact: {
      type: String,
    },
    salary: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
      min: 10,
      max: 120,
    },
    description: {
      type: String,
      required: true,
      min: 30,
    },
    status: {
      type: Boolean,
      default: false,
    },
    img: {
      type: Array,
      default: ["uploads\\tuyen-dung.png"],
    },
    writer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
    },
    career: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Career",
    },
    cv: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CV",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recruitment", RecruitmentSchema);

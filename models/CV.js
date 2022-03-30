const mongoose = require("mongoose");

const CVSchema = new mongoose.Schema(
  {
    profile: {
      type: Object,
    },
    recruitment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruitment",
    },
    writer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CV", CVSchema);

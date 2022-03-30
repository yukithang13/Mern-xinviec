const mongoose = require("mongoose");

const CareerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  recruitments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruitment",
    },
  ],
});

module.exports = mongoose.model("Career", CareerSchema);

const mongoose = require("mongoose");

const CitySchema = new mongoose.Schema({
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

module.exports = mongoose.model("City", CitySchema);

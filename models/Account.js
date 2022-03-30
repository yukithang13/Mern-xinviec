const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const AccountSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      min: 3,
      max: 25,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    role: {
      type: String,
      enum: ["spadmin", "admin", "candidate", "recruiter"],
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
    resetLink: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

AccountSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  bcrypt.hash(this.password, 10, (err, passwordHash) => {
    if (err) return next(err);
    this.password = passwordHash;
    next();
  });
});

AccountSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) return cb(err);
    else {
      if (!isMatch) return cb(null, isMatch);
      return cb(null, this);
    }
  });
};

module.exports = mongoose.model("Account", AccountSchema);

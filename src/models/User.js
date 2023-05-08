const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    min: 18,
    max: 99,
    default: 0,
  },
  email: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("In-valid email!");
      }
    },
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

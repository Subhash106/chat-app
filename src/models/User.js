const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
  password: {
    type: String,
    required: true,
    trim: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

//Add method on instance
userSchema.methods.generateAuthToken = async function () {
  const user = this;

  const token = jwt.sign({ _id: user._id.toString() }, "secret");
  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

//add static method
userSchema.statics.getUserByCredential = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }
  console.log("reached here", user);

  if (!bcryptjs.compareSync(password, user.password)) {
    throw new Error("Unable to login");
  }

  return user;
};

// hash the password before saving
userSchema.pre("save", function (next) {
  const user = this;

  console.log("Just before saving user...");
  if (user.isModified("password")) {
    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(user.password, salt);
    user.password = hash;
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;

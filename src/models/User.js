require("dotenv").config();
const mongoose = require("mongoose");
const { Unauthorized } = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 5,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
    minLength: 5,
  },

  avatar: {
    type: String,
  },

  about: {
    type: String,
    default: "New in this era !!!",
  },

  token: {
    type: String,
  },
});

userSchema.statics.findByCredentials = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw Unauthorized("Email & password are invalid");

  const isTrue = await bcrypt.compare(password, user.password);
  if (!isTrue) throw Unauthorized("Email & password are invalid");

  return user;
};

userSchema.methods.generateAuthToken = async function () {
  const _id = this._id.toString();
  const token = jwt.sign({ _id }, process.env.SECRET_KEY);
  this.token = token;
  await this.save();

  return token;
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;

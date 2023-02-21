const mongoose = require("mongoose");

const userModel = mongoose.Schema({
  email: String,
  password: String,
  isAdmin: Boolean,
});

module.exports = mongoose.model("User", userModel);

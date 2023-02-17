const mongoose = require("mongoose");

const schema = mongoose.Schema({
  email: String,
  password: String,
  isAdmin: Boolean,
});

module.exports = mongoose.model("User", schema);

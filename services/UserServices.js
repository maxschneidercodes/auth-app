const userModel = require("../models/user");

exports.getAllUsers = async () => {
  return await userModel.find();
};

exports.createUser = async (user) => {
  return await userModel.create(user);
};
exports.getUserById = async (id) => {
  return await userModel.findById(id);
};

exports.getUserByEmail = async (email) => {
  return await userModel.findOne({ email });
};

exports.updateUser = async (id, user) => {
  return await userModel.findByIdAndUpdate(id, user);
};

exports.deleteUser = async (id) => {
  return await userModel.findByIdAndDelete(id);
};

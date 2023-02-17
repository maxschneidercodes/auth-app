const userServices = require("../services/UserServices");

function isObjc(objc) {
  if (objc !== {} || objc !== undefined) {
    return true;
  }
  return false;
}

exports.checkIfUserExsists = async (req, res, email) => {
  try {
    return await userServices.getUserByEmail(email);
  } catch (err) {
    return err;
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    return await userServices.getAllUsers();
  } catch (err) {
    res.render("500", { error: err.message });
  }
};

exports.createUser = async (req, res, objc) => {
  try {
    if (isObjc(objc)) {
      return await userServices.createUser(objc);
    }
    return await userServices.createUser(req.body);
  } catch (err) {
    res.render("500", { error: err.message });
  }
};

exports.getUserById = async (req, res, id) => {
  try {
    if (id) {
      return await userServices.getUserById(id);
    }
    return await userServices.getUserById(req.params.id);
  } catch (err) {
    res.render("500", { error: err.message });
  }
};

exports.updateUser = async (req, res, objc) => {
  try {
    if (isObjc(objc)) {
      return await userServices.updateUser(req.params.id, objc);
    }
    return await userServices.updateUser(req.params.id, req.body);
  } catch (err) {
    res.render("500", { error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    return await userServices.deleteUser(req.params.id);
  } catch (err) {
    res.render("500", { error: err.message });
  }
};

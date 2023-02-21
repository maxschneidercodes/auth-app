const userController = require("../controller/UserController");

async function authMiddleWare(req, res, next) {
  const user = req.session.user;
  const isAuthenticated = req.session.isAuthenticated;

  if (!user || !isAuthenticated) {
    return next();
  }

  const userDoc = await userController.getUserById(req, res, user.id);

  if (!userDoc) {
    return next();
  }
  const isAdmin = userDoc.isAdmin;

  res.locals.isAdmin = isAdmin;
  res.locals.isAuth = isAuthenticated;
  res.locals.user = userDoc;

  next();
}

module.exports = authMiddleWare;

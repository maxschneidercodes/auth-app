const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  res.render("welcome");
});

router.get("/admin", function (req, res) {
  if (!res.locals.isAuth) {
    return res.status(401).render("401");
  }

  if (!res.locals.isAdmin) {
    return res.status(403).render("403");
  }

  res.render("admin");
});

router.get("/profile", function (req, res) {
  if (!res.locals.isAuth) {
    return res.status(401).render("401");
  }
  res.render("profile");
});

module.exports = router;

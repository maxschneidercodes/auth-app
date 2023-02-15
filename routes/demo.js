const express = require("express");
const router = express.Router();
const userController = require("../controller/UserController");
const bcrypt = require("bcrypt");

router.get("/", function (req, res) {
  res.render("welcome");
});

router.get("/signup", async function (req, res) {
  res.status(200).render("signup");
});

router.get("/login", function (req, res) {
  res.render("login");
});

router.post("/signup", async function (req, res) {
  const userData = req.body;
  const enteredUserEmail = userData.email;
  const enteredUserComfirmEmail = userData["confirm-email"];
  const enteredUserPassword = userData.password;

  if (
    !enteredUserEmail ||
    !enteredUserComfirmEmail ||
    !enteredUserPassword ||
    enteredUserPassword.trim() < 2 ||
    enteredUserEmail !== enteredUserComfirmEmail ||
    !enteredUserEmail.includes("@")
  ) {
    console.log("Error Input");
    return res.redirect("/signup");
  }

  const exsistingUser = await userController.checkIfUserExsists(
    req,
    res,
    enteredUserEmail
  );

  if (exsistingUser) {
    console.log("Email is already taken!");
    return res.redirect("/signup");
  }

  const hashedPassword = await bcrypt.hash(enteredUserPassword, 12);

  const user = {
    email: enteredUserEmail,
    password: hashedPassword,
  };

  await userController.createUser(req, res, user);
  res.render("login");
});

router.post("/login", async function (req, res) {
  const userData = req.body;
  const userEmail = userData.email;
  const userPassword = userData.password;

  const exsistingUser = await userController.checkIfUserExsists(
    req,
    res,
    userEmail
  );

  if (!exsistingUser) {
    console.log("Email not Found!");
    return res.redirect("/login");
  }

  console.log(exsistingUser);
  const passwordsAreEquael = bcrypt.compare(
    userPassword,
    exsistingUser.password
  );

  if (!passwordsAreEquael) {
    console.log("Password is Wrong!");
    return res.redirect("/login");
  }

  console.log("User is Authenticated!");

  res.redirect("/admin");
});

router.get("/admin", function (req, res) {
  res.render("admin");
});

router.post("/logout", function (req, res) {});

module.exports = router;

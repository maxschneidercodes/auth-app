const express = require("express");
const router = express.Router();
const userController = require("../controller/UserController");
const bcrypt = require("bcrypt");

router.get("/", function (req, res) {
  res.render("welcome");
});

router.get("/signup", async function (req, res) {
  let inputData = req.session.inputData;
  if (!inputData) {
    inputData = {
      hasError: false,
      message: "",
      email: "",
      comfirmEmail: "",
      userPassword: "",
    };
  }

  req.session.inputData = null;

  res.status(200).render("signup", { inputData: inputData });
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
    req.session.inputData = {
      hasError: true,
      message: "Invalid Input",
      email: enteredUserEmail,
      comfirmEmail: enteredUserComfirmEmail,
      userPassword: enteredUserPassword,
    };
    req.session.save(() => {
      res.redirect("/signup");
    });
    return;
  }

  const exsistingUser = await userController.checkIfUserExsists(
    req,
    res,
    enteredUserEmail
  );

  if (exsistingUser) {
    req.session.inputData = {
      hasError: true,
      message: "Email Already Exsists",
    };
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
    req.session.inputData = {
      hasError: true,
      message: "Email Not Found",
    };
    return res.redirect("/login");
  }

  console.log(exsistingUser);
  const passwordsAreEquael = bcrypt.compare(
    userPassword,
    exsistingUser.password
  );

  if (!passwordsAreEquael) {
    req.session.inputData = {
      hasError: true,
      message: "Email Not Found",
    };
    return res.redirect("/login");
  }

  console.log("User is Authenticated!");
  req.session.user = { id: exsistingUser._id, email: exsistingUser.email };
  req.session.isAuthenticated = true;
  req.session.save(() => {
    res.redirect("/admin");
  });
});

router.get("/admin", function (req, res) {
  if (!req.session.isAuthenticated) {
    return res.status(401).render("401");
  }
  res.render("admin");
});

router.post("/logout", function (req, res) {
  req.session.user = null;
  req.session.isAuthenticated = false;

  res.redirect("/");
});

module.exports = router;

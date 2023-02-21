const express = require("express");
const router = express.Router();
const userController = require("../controller/UserController");
const bcrypt = require("bcrypt");
const validationSession = require("../util/validation-session");
const validInput = require("../util/auth-validation");

router.get("/signup", async function (req, res) {
  const sessionErrorData = validationSession.getSignUpSessionErrorData(req);
  res.status(200).render("signup", { inputData: sessionErrorData });
});

router.get("/login", function (req, res) {
  const sessionErrorData = validationSession.getLoginSessionErrorData(req);
  res.render("login", { inputData: sessionErrorData });
});

router.post("/signup", async function (req, res) {
  const userData = req.body;
  const enteredUserEmail = userData.email;
  const enteredUserComfirmEmail = userData["confirm-email"];
  const enteredUserPassword = userData.password;

  if (
    validInput.isValidInput(
      enteredUserEmail,
      enteredUserComfirmEmail,
      enteredUserPassword
    )
  ) {
    validationSession.flashErrorsToSessions(
      req,
      {
        message: "Invalid Input",
        email: enteredUserEmail,
        comfirmEmail: enteredUserComfirmEmail,
        userPassword: enteredUserPassword,
      },
      () => {
        res.redirect("/signup");
      }
    );
    return;
  }

  const exsistingUser = await userController.checkIfUserExsists(
    req,
    res,
    enteredUserEmail
  );

  if (exsistingUser) {
    validationSession.flashErrorsToSessions(
      req,
      {
        message: "User Allready Exsists",
        email: enteredUserEmail,
        comfirmEmail: enteredUserComfirmEmail,
        userPassword: enteredUserPassword,
      },
      () => {
        res.redirect("/signup");
      }
    );

    return;
  }

  const hashedPassword = await bcrypt.hash(enteredUserPassword, 12);

  const user = {
    email: enteredUserEmail,
    password: hashedPassword,
  };

  await userController.createUser(req, res, user);
  res.redirect("/login");
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
      message: "Could not Login something went wrong - check your credentials!",
    };
    req.session.save(() => {
      res.redirect("/login");
    });
    return;
  }

  const passwordsAreEquael = bcrypt.compare(
    userPassword,
    exsistingUser.password
  );

  if (!passwordsAreEquael) {
    req.session.inputData = {
      hasError: true,
      message: "Email or Password was wrong!",
    };
    req.session.save(() => {
      res.redirect("/login");
    });
    return;
  }

  req.session.user = {
    id: exsistingUser._id,
    email: exsistingUser.email,
  };
  req.session.isAuthenticated = true;
  req.session.save(() => {
    res.redirect("/profile");
  });
});

router.post("/logout", function (req, res) {
  req.session.user = null;
  req.session.isAuthenticated = false;

  res.redirect("/");
});

module.exports = router;

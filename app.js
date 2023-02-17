const path = require("path");
const express = require("express");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const MongoDBStore = require("connect-mongodb-session")(session);
const db = require("./data/mongodb-connect");
const demoRoutes = require("./routes/demo");
const userController = require("./controller/UserController");

db.connectMongoDB();

const store = new MongoDBStore({
  uri: db.mongoDB_DATABASE_URL(),
  collection: "sessions",
});

store.on("error", function (error) {
  console.log(error);
});

app.use(
  session({
    secret: "93dfcaf3d923ec47edb8580667473987",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(async (req, res, next) => {
  const user = req.session.user;
  const isAuthenticated = req.session.isAuthenticated;

  if (!user || !isAuthenticated) {
    return next();
  }

  const userDoc = await userController.getUserById(req, res, user.id);
  const isAdmin = userDoc.isAdmin;

  res.locals.isAdmin = isAdmin;
  res.locals.isAuth = isAuthenticated;
  res.locals.user = userDoc;

  next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(demoRoutes);

app.use(function (error, req, res, next) {
  res.status(500).send("An unknown error occurred.");
});

app.listen(3000);

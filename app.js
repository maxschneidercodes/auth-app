const path = require("path");
const express = require("express");
const app = express();
const session = require("express-session");

const bodyParser = require("body-parser");

const sessionConfig = require("./config/session");

const db = require("./data/mongodb-connect");

const authMiddleWare = require("./middlewares/auth-middleware");

const demoRoutes = require("./routes/demo");
const authRoutes = require("./routes/auth");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

db.connectMongoDB();
const mongoDBSessionStore = sessionConfig.createSessionStore(
  session,
  db.mongoDB_DATABASE_URL()
);
app.use(session(sessionConfig.createSessionConifg(mongoDBSessionStore)));

app.use(authMiddleWare);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(demoRoutes);
app.use(authRoutes);

app.use(function (error, req, res, next) {
  res.status(500).send("An unknown error occurred.");
});

app.listen(3000);

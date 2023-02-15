const path = require("path");

const express = require("express");

const db = require("./util/mongodb-connect");
const demoRoutes = require("./routes/demo");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use(demoRoutes);

app.use(function (error, req, res, next) {
  res.status(500).send("An unknown error occurred.");
});

db.connectMongoDB();
app.listen(3000);

const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const db = require("./data/mongodb-connect");
db.connectMongoDB();

const demoRoutes = require("./routes/demo");

const app = express();

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

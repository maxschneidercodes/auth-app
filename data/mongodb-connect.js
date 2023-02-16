require("dotenv").config();
const mongoose = require("mongoose");

function mongoDB_DATABASE_URL() {
  const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
  const MONGODB_PASS = process.env.MONGODB_PASS;
  const MONGODB_CLUSTER_NAME = process.env.MONGODB_CLUSTER_NAME;
  const DATABASE_URL = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASS}@${MONGODB_CLUSTER_NAME}.quw9fxz.mongodb.net/?retryWrites=true&w=majority`;
  return DATABASE_URL;
}

function connectMongoDB() {
  try {
    mongoose.connect(mongoDB_DATABASE_URL());
    const db = mongoose.connection;
    db.on("error", (error) => console.error(error));
    db.once("open", () => console.log("Connected Successfully to mongoose"));
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  connectMongoDB: connectMongoDB,
  mongoDB_DATABASE_URL: mongoDB_DATABASE_URL,
};

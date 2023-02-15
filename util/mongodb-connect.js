require("dotenv").config();
const mongoose = require("mongoose");

function connectMongoDB() {
  const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
  const MONGODB_PASS = process.env.MONGODB_PASS;
  const MONGODB_CLUSTER_NAME = process.env.MONGODB_CLUSTER_NAME;
  const DATABASE_URL = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASS}@${MONGODB_CLUSTER_NAME}.levopyn.mongodb.net/?retryWrites=true&w=majority`;

  try {
    mongoose.connect(DATABASE_URL);
    const db = mongoose.connection;
    db.on("error", (error) => console.error(error));
    db.once("open", () => console.log("Connected Successfully to mongoose"));
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  connectMongoDB: connectMongoDB,
};

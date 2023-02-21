function createSessionStore(session, dbURL) {
  const MongoDBStore = require("connect-mongodb-session")(session);
  const store = new MongoDBStore({
    uri: dbURL,
    collection: "sessions",
  });
  store.on("error", function (error) {
    console.log(error);
  });
  return store;
}

function createSessionConifg(sessionStoree) {
  return {
    secret: "93dfcaf3d923ec47edb8580667473987",
    resave: false,
    saveUninitialized: false,
    store: sessionStoree,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  };
}

module.exports = {
  createSessionStore: createSessionStore,
  createSessionConifg: createSessionConifg,
};

const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const MongoStore = require("connect-mongo")(session);
const api = require("./api/controller");
const app = express();
const db = mongoose
  .connect("mongodb://localhost:27017/test")
  .then((conn) => conn)
  .catch(console.error);

//   use body parser middleware to parse the request to JSON
app.use(bodyParser.json());

// define an express js middleware that ensure connection to
// MongDB before next route handlers execute
app.use((req, res, next) => {
  Promise.resolve(db).then((conection, err) =>
    typeof connection !== "undefined" ? next() : next(new Error("MongoError"))
  );
});

// configure express-session middleware to store sessions in the mong
// database instead of in memory
api.use(
  session({
    secret: "MERN Cookbook Secrets",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      collection: "sessions",
      mongooseConnection: mongoose.connection,
    }),
  })
);

// mount the api to the "/api" route
app.use("/users", api);

// listen on 1337
app.listen(1337, () => console.log("Listening on port 1337"));

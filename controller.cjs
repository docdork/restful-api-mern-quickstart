const express = require("express");
const User = require("./model");
const api = express.Router();

// define a request handler to check if the user is
// logged in and another to if they are not.
const isLogged = ({ session }, res, next) => {
  if (!session.user)
    res.status(403).json({
      status: "You are not logged in!",
    });
  else next();
};

const isNotLogged = ({ session }, res, next) => {
  if (session.user)
    res.status(403).json({
      status: "You are logged in already!",
    });
  else next();
};

// define a post request method to handle request to "/login" endpoint
api.post("/login", isNotLogged, async (req, res) => {
  try {
    const { session, body } = req;
    const { username, password } = body;
    const user = await User.login(username, password);
    session.user = {
      _id: user._id,
      username: user.username,
    };
    session.save(() => {
      res.status(200).json({ status: "Welcome!" });
    });
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
});

// define a post request method to handle requests to "/logout" endpoint

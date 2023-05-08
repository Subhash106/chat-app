const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

const route = new express.Router();

route.get("/users", async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

route.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400);
    res.send(error);
  }
});

route.post("/users/login", async (req, res) => {
  const {
    body: { email, password },
  } = req;

  try {
    const user = await User.getUserByCredential(email, password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400);
    res.send(error);
  }
});

route.get("/users/me", authMiddleware, async (req, res) => {
  res.send(req.user);
});

route.get("/users/logout", authMiddleware, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

route.get("/users/:id", authMiddleware, async (req, res) => {
  const {
    params: { id },
  } = req;

  try {
    const user = await User.findOne({ _id: id });
    res.send(user);
  } catch (error) {
    res.status(500);
    res.send(error);
  }
});

module.exports = route;

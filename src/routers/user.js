const express = require("express");
const User = require("../models/User");

const route = new express.Router();

route.get("/users", async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

route.get("/users/:id", async (req, res) => {
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

module.exports = route;

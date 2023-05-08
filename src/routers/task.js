const express = require("express");
const Task = require("../models/Task");

const route = new express.Router();

route.get("/tasks", async (req, res) => {
  const tasks = await Task.find({});
  res.send(tasks);
});

route.post("/tasks", async (req, res) => {
  const task = new Task(req.body);
  try {
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(400);
    res.send(error);
  }
});

module.exports = route;

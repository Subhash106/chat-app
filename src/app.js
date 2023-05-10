require("./db/mongoose");
const taskRoutes = require("./routers/task");
const userRoutes = require("./routers/user");
const { generateMessage } = require("./utils");

const path = require("path");
const http = require("http");

const express = require("express");
const { Server } = require("socket.io");

const port = process.env.PORT || 3001;
const templatePath = path.join(__dirname, "../templates");
const publicDir = path.join(__dirname, "../public");
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// set up view engine and handlebar
app.set("view engine", "hbs");
app.set("views", templatePath);

//custom middleware
//app.use(authMiddleware);
// app.use((req, res, next) => {
//   console.log(req.method, req.path);

//   next();
// });

//use static assets
app.use(express.static(publicDir));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index", {
    title: "Page from express and hbs template",
    firstName: "Subash",
    lastName: "Chandra",
  });
});

// app.get("/user", (req, res) => {
//   res.json({ firstName: "Subash", lastName: "Chandra", age: 32 });
// });

// app.get("/set-cookie", (req, res) => {
//   res.setHeader("Set-Cookie", "name=value; HttpOnly=true; Secure");
//   res.send({ firstName: "Subash", age: 32 });
// });

// app.get("/posts/*", (req, res) => {
//   res.send("404 | Post Not found!");
// });

//Task routes
app.use(taskRoutes);
//User routes
app.use(userRoutes);

// 404 handler
app.get("*", (req, res) => {
  res.send("404 | Not found!");
});

io.on("connection", (socket) => {
  socket.on("join", ({ username, room }) => {
    socket.join(room);
    socket.emit("message", generateMessage(`Welcome, ${username}`));
    socket.broadcast
      .to(room)
      .emit("message", generateMessage(`${username} has joined the chat`));
  });

  socket.on("sendMessage", function (message, callback) {
    io.emit("message", generateMessage(message));

    if (typeof callback === "function") {
      callback();
    }
  });

  socket.on("sendLocation", function (location, callback) {
    socket.broadcast.emit("messageLocation", generateMessage(location));
    if (typeof callback === "function") {
      callback();
    }
  });

  socket.on("disconnect", () => {
    io.emit("message", generateMessage("x is leaving the chat"));
  });
});

server.listen(port, () => {
  console.log(`App is running on port number ${port}`);
});

require("./db/mongoose");
const taskRoutes = require("./routers/task");
const userRoutes = require("./routers/user");
const { generateMessage } = require("./utils/utils");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/user");

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

//Task routes
app.use(taskRoutes);
//User routes
app.use(userRoutes);

// 404 handler
app.get("*", (req, res) => {
  res.send("404 | Not found!");
});

io.on("connection", (socket) => {
  socket.on("join", ({ username, room }, cb) => {
    const { user, error } = addUser({ id: socket.id, username, room });

    if (error) {
      return cb(error);
    }

    socket.join(user.room);
    socket.emit(
      "message",
      generateMessage(user.username, `Welcome, ${user.username}`)
    );
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        generateMessage(user.username, `${user.username} has joined the chat`)
      );
    io.to(user.room).emit("userData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
  });

  socket.on("sendMessage", function (message, callback) {
    const { room, username } = getUser(socket.id);
    io.to(room).emit("message", generateMessage(username, message));

    if (typeof callback === "function") {
      callback();
    }
  });

  socket.on("sendLocation", function (location, callback) {
    const { room, username } = getUser(socket.id);

    socket
      .to(room)
      .emit("messageLocation", generateMessage(username, location));

    if (typeof callback === "function") {
      callback();
    }
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id) || {};
    io.to(user.room).emit(
      "message",
      generateMessage(`${user.username} has left the chat`)
    );

    io.to(user.room).emit("userData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
  });
});

server.listen(port, () => {
  console.log(`App is running on port number ${port}`);
});

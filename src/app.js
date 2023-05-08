require("./db/mongoose");
const path = require("path");
const express = require("express");
const taskRoutes = require("./routers/task");
const userRoutes = require("./routers/user");

const port = process.env.PORT || 3001;

const templatePath = path.join(__dirname, "../templates");
const publicDir = path.join(__dirname, "../public");
const app = express();

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

// app.get("/", (req, res) => {
//   res.render("index", {
//     title: "Page from express and hbs template",
//     firstName: "Subash",
//     lastName: "Chandra",
//   });
// });

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

app.listen(port, () => {
  console.log(`App is running on port number ${port}`);
});

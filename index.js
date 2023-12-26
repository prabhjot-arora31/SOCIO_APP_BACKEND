const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const db = require("./db/db");
const session = require("express-session");
app.use(express.static(path.join(__dirname, "views")));
app.set("view engine", "ejs");
app.use(
  session({
    secret: "hfguiO97$$#@175eREE6^2vG", // Change this to a secure random string
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
db();

app.use("/", require("./routes/registerRoute"));
app.use("/", require("./routes/loginRoute"));
app.use("/", require("./routes/postRoute"));
app.use("/", require("./routes/deleteAccountRoute"));
app.use("/", require("./routes/homeRoute"));
app.use("/", require("./routes/logoutRoute"));
app.use("/", require("./routes/showAllUsers"));
app.use("/", require("./routes/connectionRequestRoute"));
app.listen(3001, () => {
  console.log("Listening on the port 3001");
});

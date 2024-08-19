const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const cors = require("cors");
const httpServer = require("http").createServer(app);
// const io = require("socket.io")(httpServer);
const db = require("./db/db");
const session = require("express-session");
app.use(cors());
const initializeSocket = require("./socketHandler");
app.use(express.static(path.join(__dirname, "views")));
app.set("view engine", "ejs");
app.use(
  session({
    secret: "hfguiO97$$#@175eREE6^2vG", // Change this to a secure random string
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true } ,
    store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
  }),
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
db();
initializeSocket(httpServer);
app.use("/", require("./routes/registerRoute"));
app.use("/", require("./routes/loginRoute"));
app.use("/", require("./routes/postRoute"));
app.use("/", require("./routes/deleteAccountRoute"));
app.use("/", require("./routes/homeRoute"));
app.use("/", require("./routes/logoutRoute"));
app.use("/", require("./routes/showAllUsers"));
app.use("/", require("./routes/connectionRequestRoute"));
app.use("/", require("./routes/chatsRoute"));
app.use("/", require("./routes/pendingRequest"));
// app.use("/", require("./routes/fetchingUserDataForConnectionRequest"));
app.use("/", require("./routes/fetchingUserDataForConnectionRequest"));
app.use("/", require("./routes/acceptConnection"));
app.use("/", require("./routes/rejectConnection"));
app.use("/", require("./routes/userChat"));
app.use("/", require("./routes/profilePicById"));
app.use("/", require("./routes/chatReceiver"));
httpServer.listen(3001, () => {
  console.log("Listening on the port 3001");
});
module.exports = app;

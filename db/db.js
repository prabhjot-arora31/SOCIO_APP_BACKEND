const mongoose = require("mongoose");
require("dotenv").config();
function db() {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connection to Database is established");
    })
    .catch((err) => console.log("Connection to Database is failed: " + err));
}
module.exports = db;

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  profileImg: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  description: String,
});

const User = mongoose.model("User", UserSchema);

module.exports = User;

const mongoose = require("mongoose");
const chatSchema = mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: String,
  timestamp: { type: Date, default: Date.now },
  roomId: String,
});
const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;

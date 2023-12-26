const mongoose = require("mongoose");
const RelationshipSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  followed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    default: "Connect",
  },
});
const Relationship = mongoose.model("Relationship", RelationshipSchema);
module.exports = Relationship;

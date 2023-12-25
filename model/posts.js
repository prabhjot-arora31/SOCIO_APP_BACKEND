const mongoose = require("mongoose");
const PostSchema = mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  postDesc: {
    type: String,
    required: true,
  },
  author: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: String,
  },
});
const Post = mongoose.model("Post", PostSchema);
module.exports = Post;

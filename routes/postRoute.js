const User = require("../model/users");
const Post = require("../model/posts");
const router = require("express").Router();
router.post("/create-post", async (req, res) => {
  const { imageUrl, postDescription, _id } = req.body;
  console.log("Image URL: " + imageUrl + " " + postDescription);
  try {
    const post = new Post({
      imageUrl,
      postDesc: postDescription,
      author: { userId: _id },
    });
    console.log("Post is:" + post);
    await post.save();
    // res.send("Post created successfully");
    res.redirect("http://localhost:3001/home/" + _id);
  } catch (error) {
    res.send("Post has not been created!");
  }
});
module.exports = router;

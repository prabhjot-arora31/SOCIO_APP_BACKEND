const User = require("../model/users");
const Post = require("../model/posts");
const router = require("express").Router();
function authenticateUser(req, res, next) {
  if (req.session && req.session.user) {
    // Assuming session-based authentication
    // User is authenticated, allow access to the route
    next();
  } else {
    // User is not authenticated, redirect to login page or send unauthorized response
    res.status(401).send("Unauthorized");
  }
}
router.get("/home/:id/", async (req, res) => {
  try {
    const id = req.params.id;
    //  const id = req.session.user._id;
    console.log(id);
    console.log("inside home:the session is:", req.session);
    console.log("ID IS:", id);
    const userData = await User.findOne({ _id: id });
    if (!userData) {
      // Handle scenario when user data is not found
      res.status(404).send("User not found");
      // or render an error page
      // res.render('error.ejs', { errorMessage: 'User not found' });
    } else {
      console.log(id);
      const userPosts = await Post.find({ "author.userId": id });
      // const userPosts = await Post.find(); // find all posts
      console.log(userPosts);
      res.render("Home.ejs", { userData, userPosts });
    }
  } catch (error) {
    // Handle other errors (e.g., database connection errors)
    console.error(error);
    res.status(500).send("Internal Server Error");
    // or render an error page
    // res.render('error.ejs', { errorMessage: 'Internal Server Error' });
  }
});
module.exports = router;

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
router.get("/home/:id/", authenticateUser, async (req, res) => {
  try {
    const id = req.params.id;
    let userId;

    try {
      userId = mongoose.Types.ObjectId(id);
    } catch (error) {
      // Handle scenario when the provided ID is not a valid ObjectId format
      res.status(400).send("Invalid user ID format");
      // or render an error page
      // res.render('error.ejs', { errorMessage: 'Invalid user ID format' });
      return;
    }

    console.log("ID IS:", id);
    const userData = await User.findOne({ _id: userId });
    if (!userData) {
      // Handle scenario when user data is not found
      res.status(404).send("User not found");
      // or render an error page
      // res.render('error.ejs', { errorMessage: 'User not found' });
    } else {
      console.log(userId);
      const userPosts = await Post.find({ "author.userId": userId });

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

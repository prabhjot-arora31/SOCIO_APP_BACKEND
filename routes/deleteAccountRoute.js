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
router.post("/delete-account/:id", authenticateUser, async function (req, res) {
  const account_id = req.params.id;
  console.log("User id to delete:", account_id);
  const user = await User.findOneAndDelete({ _id: account_id });
  if (user) {
    res.redirect("http://localhost:3001/");
  } else {
    return res.status(404).send("User not found");
  }
});
module.exports = router;

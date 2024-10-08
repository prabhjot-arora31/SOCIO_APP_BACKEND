const path = require("path");
const router = require("express").Router();
const User = require("../model/users");
const relationship = require("../model/relationship");
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
router.get("/:id/users", async (req, res) => {
  try {
    console.log("user id: " + req.params.id);
    const users = await User.find({ _id: { $ne: req.params.id } });
    const relation = await relationship
      .find({ follower: req.params.id })
      .populate("followed", "name profileImg") // Populate the followed user's name
      .exec();
    console.log("from showAllUsers.js:", users);

    res.render(path.join(__dirname, "../views/users.ejs"), {
      users: users,
      id: req.params.id,
      relation: relation,
    });
  } catch (err) {
    res.send("Error while fetching user ID");
  }
});
module.exports = router;

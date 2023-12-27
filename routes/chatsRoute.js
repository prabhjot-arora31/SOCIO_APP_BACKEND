const router = require("express").Router();
const relationship = require("../model/relationship");
const User = require("../model/users");
router.get(
  "/chats",
  (req, res, next) => {
    if (req.session && req.session.user) {
      // Assuming session-based authentication
      // User is authenticated, allow access to the route
      next();
    } else {
      // User is not authenticated, redirect to login page or send unauthorized response
      res.status(401).send("Unauthorized");
    }
  },
  async (req, res) => {
    const users = await User.find({ _id: { $ne: req.session.user._id } });
    const loggedInUserId = req.session.user._id;
    res.render("Chats.ejs", { id: loggedInUserId, user: users });
  }
);
module.exports = router;

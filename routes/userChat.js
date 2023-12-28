const router = require("express").Router();
const path = require("path");
const Relationship = require("../model/relationship");
const User = require("../model/users");
router.get(
  "/chats/:chatId",
  async (req, res, next) => {
    if (req.session && req.session.user) {
      // Assuming session-based authentication
      // User is authenticated, allow access to the route
      next();
    } else {
      // User is not authenticated, redirect to login page or send unauthorized response
      res.status(401).send("Unauthorized");
    }
  },
  async function (req, res) {
    const chatId = req.params.chatId;
    console.log("Chat ID: " + chatId);
    const loggedInUserId = req.session.user._id;

    // Find relationships where the logged-in user is involved and status is "Accepted"
    const acceptedRelationships = await Relationship.find({
      $or: [
        { follower: loggedInUserId, status: "Accepted" },
        { followed: loggedInUserId, status: "Accepted" },
      ],
    });

    // Extract user IDs from the accepted relationships excluding the logged-in user
    const userIds = acceptedRelationships
      .map((relationship) => {
        return relationship.follower === loggedInUserId
          ? relationship.followed
          : relationship.follower;
      })
      .filter((userId) => userId.toString() !== loggedInUserId);

    // Fetch users with the filtered IDs
    const users = await User.find({ _id: { $in: userIds } });
    res.render(path.join(__dirname, "../views/userChat.ejs"), {
      id: loggedInUserId,
      user: users,
      chatId: chatId,
    });
  }
);
module.exports = router;

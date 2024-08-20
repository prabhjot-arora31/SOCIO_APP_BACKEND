const router = require("express").Router();
const Relationship = require("../model/relationship");
const User = require("../model/users");

router.get(
  "/:id/chats",

  async (req, res) => {
    try {
      // console.log("user is: ", req.session.user);
      const loggedInUserId = req.params.id;

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
      console.log("users are:", users);
      res.render("Chats.ejs", { id: loggedInUserId, user: users });
    } catch (error) {
      console.error("Error fetching chats:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;

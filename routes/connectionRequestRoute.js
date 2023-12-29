const router = require("express").Router();
const Relationship = require("../model/relationship");
const Notification = require("../model/notification");
const User = require("../model/users");

router.post("/send-request", async (req, res) => {
  const targetId = req.body.id;
  const loggedInUserId = req.session.user._id;
  console.log("ID: " + targetId);
  var text;

  try {
    const existingRelationship = await Relationship.findOne({
      follower: loggedInUserId,
      followed: targetId,
    });

    if (existingRelationship) {
      text = "Request already sent";
      return res.status(400).send(text);
    }

    // Create a new relationship
    const newRelationship = await Relationship({
      follower: loggedInUserId,
      followed: targetId,
      status: "Pending",
    });

    await newRelationship.save();
    text = "Pending";

    // Create a new notification
    const notification = new Notification({
      senderId: loggedInUserId,
      recipientId: targetId,
      type: "connectionRequest",
      message: "Sent you a connection request",
      status: "Pending",
    });
    console.log("Notification:(after sending request) " + notification);
    await notification.save();

    res.redirect("http://localhost:3001/users/");
  } catch (error) {
    console.log("Error: " + error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

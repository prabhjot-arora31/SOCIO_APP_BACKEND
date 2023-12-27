const Notification = require("../model/notification");
const User = require("../model/users"); // Assuming your user model is named "User"
const router = require("express").Router();

// Express route to handle fetching pending connection requests
router.get("/pending-requests", async (req, res) => {
  try {
    // Fetch pending notification data from your database
    // For example, using a MongoDB model
    const notifications = await Notification.find({
      recipientId: req.session.user._id,
      status: "Pending",
    })
      .populate("senderId", "name") // Populate senderId field with the name of the sender
      .exec();
    console.log("Notifications: ", notifications);
    // Render the EJS file with the populated notification data
    res.json(notifications); // Assuming "pending-requests.ejs" is the EJS file
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

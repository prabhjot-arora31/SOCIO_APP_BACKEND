const router = require("express").Router();
const Relationship = require("../model/relationship");
const Notification = require("../model/notification");
router.post("/accept-connection", async function (req, res) {
  try {
    const id = req.session.user._id;
    const whoseId = req.body.id;
    console.log("got in accept connection");
    const updatedRelationship = await Relationship.findOneAndUpdate(
      { follower: whoseId, followed: id },
      { $set: { status: "Accepted" } },
      { new: true }
    );
    const notification = await Notification.findOneAndUpdate(
      { senderId: whoseId, recipientId: id },
      { $set: { status: "Accepted" } },
      { new: true }
    );
    if (updatedRelationship) res.redirect("https://socio-app-backend-nine.vercel.app/home/" + id);
    else return res.status(404).send("Relationship not found");
  } catch (error) {
    console.error("Error accepting connection:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

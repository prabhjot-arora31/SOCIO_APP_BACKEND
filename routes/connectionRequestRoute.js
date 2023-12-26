const router = require("express").Router();
const relationship = require("../model/relationship");
const User = require("../model/users");
router.post("/send-request", async (req, res) => {
  const targetId = req.body.id;
  const loggedInUserId = req.session.user._id;
  console.log("ID: " + targetId);
  var text;
  try {
    const existingRelationship = await relationship.findOne({
      follower: loggedInUserId,
      followed: targetId,
    });
    if (existingRelationship) {
      text = "Request already sent";
      return res.status(400).send(text);
    }
    const newRelationship = await relationship({
      follower: loggedInUserId,
      followed: targetId,
      status: "Pending",
    });
    await newRelationship.save();
    text = "Pending";
    res.redirect("https://socio-app-y5og.onrender.com/users/");
  } catch (error) {
    console.log("Error: " + error.message);
  }
});
module.exports = router;

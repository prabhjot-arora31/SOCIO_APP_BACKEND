const User = require("../model/users");

const router = require("express").Router();
router.get("/getProfilePic/:id", async (req, res) => {
  console.log("get into profilePic route!");
  const id = req.params.id;
  const user = await User.findById(id);
  if (user) {
    const profilePic = user.profileImg;
    res.json({ pic: profilePic });
  } else {
    res.json({ error: "error" });
  }
});
module.exports = router;

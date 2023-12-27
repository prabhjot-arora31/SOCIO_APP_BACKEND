const express = require("express");
const router = express.Router();
const User = require("../model/users");

router.get("/user/:id", async (req, res) => {
  const userId = req.params.id;
  console.log("got in here ha?");
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;

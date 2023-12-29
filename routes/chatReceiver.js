const Chat = require("../model/chats");

const router = require("express").Router();
router.post("/chatReceiver", async function (req, res) {
  const { sender, receiver, message } = req.body;
  try {
    const chat = new Chat({ sender, receiver, message, timestamp: Date.now() });
    await chat.save();

    console.log("CHAT RECEIVED , WOHOOOOOOOO: ", message);
    res.json({ data: chat });
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;

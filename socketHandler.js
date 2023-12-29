const socketIO = require("socket.io");
const Chat = require("./model/chats");

function initializeSocket(server) {
  const io = socketIO(server);

  const chatsIO = io.of(/^\/chats\/\w+$/);

  chatsIO.on("connection", async (socket) => {
    console.log("A user connected");

    let receiverID, senderID, roomID;

    socket.on("private-message", async (rID) => {
      receiverID = rID.receiver;
      senderID = rID.sender;
      console.log("Receiver ID is:", receiverID);
      console.log("Sender ID is:", senderID);

      roomID =
        senderID < receiverID
          ? `${senderID}-${receiverID}`
          : `${receiverID}-${senderID}`;
      socket.join(roomID);
      console.log("Joined room:", roomID);

      try {
        // Fetch previous messages from the database for this roomID
        const chats = await Chat.find({
          $or: [
            { sender: senderID, receiver: receiverID },
            { sender: receiverID, receiver: senderID },
          ],
        }).sort({ timestamp: 1 });

        console.log("PM: ", chats);
        // Emit previous messages to the client
        socket.emit("previous-messages", chats);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });

    // Handle other events or logic here
    socket.on("newChat", (data) => {
      console.log("newChat:", data);
      chatsIO.emit("loadNewChat", data);
    });
  });
}

module.exports = initializeSocket;

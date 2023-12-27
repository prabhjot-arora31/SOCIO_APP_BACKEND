const socketIO = require("socket.io");

function initializeSocket(server) {
  const io = socketIO(server);
  // io.of()
  const chatsIO = io.of("/chats");
  chatsIO.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("message", (message) => {
      console.log(message);
      socket.emit("message", message);
    });
    // Handle events here (e.g., socket.on, socket.emit)
  });
}

module.exports = initializeSocket;

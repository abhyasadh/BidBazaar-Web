const userSocketMap = new Map();
let ioInstance = null;

function socketHandler(io) {
  ioInstance = io;

  io.on("connection", (socket) => {
    socket.on("register-user", (userId) => {
      userSocketMap.set(userId, socket.id);
    });

    socket.on("join-room", (productId) => {
      console.log("User joined room:", productId);
      socket.join(String(productId));
    });

    socket.on("leave-room", (productId) => {
      socket.leave(String(productId));
    });

    socket.on("disconnect", () => {
      for (const [userId, id] of userSocketMap.entries()) {
        if (id === socket.id) {
          userSocketMap.delete(userId);
          break;
        }
      }
      console.log("User disconnected:", socket.id);
    });
  });
}

function getIo() {
  return ioInstance;
}

module.exports = {socketHandler, getIo, userSocketMap};

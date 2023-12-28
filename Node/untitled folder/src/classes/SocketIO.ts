import { Server } from "socket.io";

const connectedUsers = [];
let io;

const setupSocketIO = (server) => {
  io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    //console.log("socket connected on backend");
    connectedUsers.push(socket.id);

    socket.on("getConnectedUsers", () => {
      io.sockets.emit("returnConnectedUsers", connectedUsers.length);
    });

    socket.on("disconnect", () => {
      const socketIdToRemoveIndex = connectedUsers.findIndex(
        (id) => id === socket.id
      );
      if (socketIdToRemoveIndex !== -1) {
        connectedUsers.splice(socketIdToRemoveIndex, 1);
      }
      io.sockets.emit("connectedUsers", connectedUsers.length);
    });
  });
};

class Socket {
  emit(event, data) {
    io.sockets.emit(event, data);
  }

  to(roomId, event, data) {
    io.sockets.to(roomId).emit(event, data);
  }

  toUser(userId, event, data) {
    io.sockets.to(userId).emit(event, data);
  }
}

export { setupSocketIO, Socket };

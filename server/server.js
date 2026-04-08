require("dotenv").config();
const http = require("http");
const app = require("./src/app");

// IMPORT THE SCHEDULER
require("./src/services/punch.service");

const { Server } = require("socket.io");

const PORT = process.env.PORT || 5000;

// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ Attach Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// ✅ Make globally accessible
global.io = io;

// ✅ Socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (empId) => {
    socket.join(`${empId}`);
    console.log(`User joined room emp_${empId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ❗ IMPORTANT: use server.listen, NOT app.listen
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

const socketIO = require("socket.io");
const postHandler = require("./Handler/postHandler");
const userHandler = require("./Handler/userHandler");
const users = {};
let io;

const InitSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {


    // Nhận dữ liệu bổ sung từ client khi họ kết nối
    socket.on("sendAdditionalData", (data) => {

      users[data.userId] = { socketId: socket.id, ...data };
      io.emit("onlineUser", { userId: data.userId , online: true});

    });
    socket.on("findOnlineUser", (data) => {
      const { userId, userEmit } = data;

      // Kiểm tra xem userId có trong danh sách users không
      const user = users[userId];

      if (user) {
        // Nếu user online, emit lại cho người yêu cầu (userEmit)
        const socketEmit = users[userEmit]?.socketId;
        if (socketEmit) {
          io.to(socketEmit).emit("onlineUser", {
            userId,
            online: true,
            socketId: user.socketId,
          });
        }
      } else {
        // Nếu user offline
        const socketEmit = users[userEmit]?.socketId;
        if (socketEmit) {
          io.to(socketEmit).emit("onlineUser", { userId, online: false });
        }
      }
    });

    socket.on("join_room", (data) => {
      const room = `room_${data.room_id}`;
      socket.join(room);
    });
    socket.on("navigate", (data) => {
      const { listUser} = data; // `listuser` là danh sách user cần kiểm tra
      console.log(listUser)
      // Lọc danh sách user online
      const onlineUsers = listUser
        .map((userId) => ({ userId: userId._id, socketId: users[userId._id]?.socketId }))
        .filter((user) => user.socketId); // Chỉ lấy những user có socketId (online)
    
      // Emit sự kiện `navigate` cho từng user online
      onlineUsers.forEach((user) => {
        io.to(user.socketId).emit("navigate", {});
      });
    });    
    // Gọi hàm xử lý trong các module khác
    postHandler(io, socket, users);
    userHandler(io, socket, users);

    // Xử lý sự kiện ngắt kết nối
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      const userId = Object.keys(users).find(
        (key) => users[key].socketId === socket.id
      );
      if (userId) {
        delete users[userId];
      }
    });
  });
};

module.exports = { InitSocket, getIO: () => io };

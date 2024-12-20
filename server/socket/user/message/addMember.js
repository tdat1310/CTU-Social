const AddMemberGroupChat = async (io, socket, data, users) => {
    const { memberIds } = data;
  
    // Tìm tất cả các người dùng trực tuyến từ memberIds
    const onlineMemberIds = memberIds.filter((memberId) => memberId in users);
  
    // Emit sự kiện cho từng người dùng trực tuyến
    onlineMemberIds.forEach((memberId) => {
      // Bạn cần có cách xác định socket ID của từng người dùng trực tuyến.
      // Giả sử `users[memberId]` chứa socket ID của người dùng trực tuyến.
      const userSocketId = users[memberId].socketId; // Đảm bảo rằng bạn có thông tin socketId
  
      // Emit sự kiện cho socket của người dùng
      if (userSocketId) {
        io.to(userSocketId).emit("AddMemberGroupChat", data);
      }
    });
  };
module.exports = AddMemberGroupChat;
  
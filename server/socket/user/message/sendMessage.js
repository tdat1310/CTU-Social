const { Models } = require("../../../models/AllModel");

const SendMessage = async (io, socket, data, users) => {
  const { NguoiGui_id, NhomChat_id, NoiDung, type, groupType } = data;
  // console.log(NhomChat_id)
  try {
    // 1. Tạo tin nhắn mới (chỉ nếu loại là 'text')
    let newMessage;
    if (type === "text") {
      newMessage = await Models.TinNhan.create({
        NguoiGui_id,
        NhomChat_id,
        NoiDung,
        seen: [] ,
      });
    }

    // 2. Thêm tin nhắn vào NhomChat
    const nhomChat = await Models.NhomChat.findById(NhomChat_id);
    if (!nhomChat) return;

    if (type === "text") {
      nhomChat.TinNhan.push(newMessage._id);
      await nhomChat.save();
    }

    // 3. Phát sự kiện Socket.IO tới các thành viên trong nhóm chat
    const room = `room_${NhomChat_id}`;
    io.to(room).emit("new_message", { room: NhomChat_id });
     // 4. Gửi thông báo tới socket id của từng thành viên trong nhóm chat
    nhomChat.ThanhVien.forEach(member => {
      if (member._id !== NguoiGui_id) {
        const userSocketId = users[member._id]?.socketId; // Lấy socketId từ object users
        if (userSocketId) {
          io.to(userSocketId).emit("notify_message", {
            message: "Bạn có tin nhắn mới!",
            NhomChat_id,
          });
        }
      }
    });
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

module.exports = SendMessage;

const TaiKhoan = require("../../../models/TaiKhoanModel");
const ThongBao = require("../../../models/ThongBaoModel");

const CreateGroupChat = async (io, socket, data, users) => {
  const { memberIds, owner, type } = data;
  // console.log(memberIds)
  // Tìm tất cả các người dùng trực tuyến từ memberIds
  const onlineMemberIds = memberIds.filter((memberId) => memberId in users);
  // Emit sự kiện cho từng người dùng trực tuyến
  await onlineMemberIds.forEach(async (memberId) => {
    if (type === "group") {
      const TaiKhoanCreateGroup = await TaiKhoan.findById(owner, "userName");
      // 2. Tạo thông báo mới
      const notification = new ThongBao({
        TaiKhoan_id: memberId,
        fromUser: owner,
        NoiDung: {
          userName: TaiKhoanCreateGroup.userName,
          info: " đã thêm bạn vào nhóm chat",
        },
      });
      await notification.save();
    }
    // Bạn cần có cách xác định socket ID của từng người dùng trực tuyến.
    // Giả sử `users[memberId]` chứa socket ID của người dùng trực tuyến.
    const userSocketId = users[memberId].socketId; // Đảm bảo rằng bạn có thông tin socketId
    // console.log(userSocketId)
    // Emit sự kiện cho socket của người dùng
    if (userSocketId) {
      io.to(userSocketId).emit("newGroupChat", data);
      if (type === "group")
        io.to(userSocketId).emit(
          "notify_response",
          `user  is now following you`
        );
    }
  });
};
module.exports = CreateGroupChat;

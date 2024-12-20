const { Models } = require("../../../models/AllModel");
const ThongBao = Models.ThongBao;

const inviteJoinGroup = async (io, socket, data, users) => {
  const { groupId, memberIds, inviterId} = data;

  // Tìm tất cả các người dùng trực tuyến từ memberIds
  const onlineMemberIds = memberIds.filter((memberId) => memberId in users);
  const group = await Models.NhomNguoiDung.findById(groupId)
  const groupName = group.TenNhom
  // Emit sự kiện cho từng người dùng trực tuyến
  onlineMemberIds.forEach(async (memberId) => {
    const userSocketId = users[memberId]?.socketId; // Đảm bảo rằng bạn có thông tin socketId

    // Tạo thông báo cho người dùng được mời
    if (memberId !== inviterId) {
      const TaiKhoan = await Models.TaiKhoan.findById(inviterId, "userName");

      // 1. Tạo thông báo mới
      const notification = new ThongBao({
        TaiKhoan_id: memberId,
        fromUser: inviterId,
        fromGroup: groupId,
        NoiDung: {
          userName: TaiKhoan.userName,
          info: ` đã mời bạn tham gia nhóm ${groupName}.`,
          type: "invite",
        },
      });
      await notification.save();
    }

    // Emit sự kiện cho socket của người dùng
    if (userSocketId) {
      io.to(userSocketId).emit("notify_response", { groupId, inviterId });
    }
  });
};

module.exports = inviteJoinGroup;

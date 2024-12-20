const { Models } = require("../../../models/AllModel");
const ThongBao = Models.ThongBao;

const requestApprovalForJoinGroup = async (io, socket, data, users) => {
  const { groupId, requesterId, groupName } = data; // Đổi inviterId thành requesterId

  // Tìm nhóm và lấy thông tin về nhóm trưởng và những người có quyền chấp nhận
  const group = await Models.NhomNguoiDung.findById(groupId)
    .populate('RoleGroup.accept')
    .populate('TruongNhom');

  // Lấy tất cả memberIds từ nhóm
  const memberIds = group.ThanhVien; // Giả sử bạn có trường này trong mô hình nhóm

  // Tìm tất cả các người dùng trực tuyến từ memberIds
  const onlineMemberIds = memberIds.filter((memberId) => memberId in users);

  // Kết hợp nhóm trưởng và những người có quyền chấp nhận
  const acceptMembers = group.RoleGroup.accept.map(member => member._id.toString());
  const leaderId = group.TruongNhom.toString();

  // Thêm nhóm trưởng vào danh sách chấp nhận
  if (!acceptMembers.includes(leaderId)) {
    acceptMembers.push(leaderId);
  }

  // Chọn ngẫu nhiên một người trong số những người có quyền chấp nhận
  if (acceptMembers.length > 0) {
    const randomIndex = Math.floor(Math.random() * acceptMembers.length);
    const chosenMemberId = acceptMembers[randomIndex];

    // Tạo thông báo cho người dùng được mời
    onlineMemberIds.forEach(async (memberId) => {
      const userSocketId = users[memberId]?.socketId; // Đảm bảo rằng bạn có thông tin socketId

      if (memberId !== requesterId) { // Đổi inviterId thành requesterId
        const TaiKhoan = await Models.TaiKhoan.findById(requesterId, "userName");

        // 1. Tạo thông báo mới
        const notification = new ThongBao({
          TaiKhoan_id: memberId,
          fromUser: requesterId,
          fromGroup: groupId,
          NoiDung: {
            userName: TaiKhoan.userName,
            info: ` đã yêu cầu tham gia nhóm ${groupName}.`,
            type: 'request',
          },
        });
        await notification.save();
      }

      // Emit sự kiện cho socket của người dùng
      if (userSocketId) {
        io.to(userSocketId).emit("notify_response", { groupId, requesterId });
      }
    });

    // Emit sự kiện cho người được chọn để chấp nhận yêu cầu
    const chosenUser  = users[chosenMemberId]?.socketId; // Sửa lại ở đây
    if (chosenUser ) { // Sửa lại ở đây
      io.to(chosenUser ).emit("notify_response", {
        groupId,
        memberIds,
        requesterId, // Đổi inviterId thành requesterId
        groupName,
      });
    }
  }
};

module.exports = requestApprovalForJoinGroup;
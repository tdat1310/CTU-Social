const { Models } = require("../../../models/AllModel");
const TaiKhoan = Models.TaiKhoan;
const ThongBao = Models.ThongBao;

const FollowUser = async (io, socket, users, data) => {
  try {
    const { owner, followBy, opt } = data;
    const userSocketId = users[owner]?.socketId;
    if (opt == 1 && userSocketId) {
      io.to(userSocketId).emit(
        "notify_response",
        `unfollow`
      );
    }
    if (opt == 2) {
      // console.log(data)
      // 1. Thêm ID người dùng vào thuộc tính NguoiTheoDoi của người dùng được theo dõi
      const userOwner = await TaiKhoan.findById(owner);
      const userInteract = await TaiKhoan.findById(followBy);
      if (userOwner) {
        if (!userOwner.NguoiTheoDoi.includes(followBy)) {
          userOwner.NguoiTheoDoi.push(followBy);
          await userOwner.save();
        }
      }
      if (userInteract) {
        if (!userInteract.TheoDoi.includes(owner)) {
          userInteract.TheoDoi.push(owner);
          await userInteract.save();
        }
      }

      if (owner !== followBy) {
        const TaiKhoanFollowBy = await TaiKhoan.findById(followBy, "userName");

        // 2. Tạo thông báo mới
        const notification = new ThongBao({
          TaiKhoan_id: owner,
          fromUser: followBy,
          NoiDung: {
            userName: TaiKhoanFollowBy.userName,
            info: " đã theo dõi bạn.",
            type: "follow"
          },
        });
        await notification.save();

        // 3. Gửi phản hồi lại cho người dùng
        if (userSocketId) {
          io.to(userSocketId).emit(
            "notify_response",
            `user ${followBy} is now following you`
          );
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = FollowUser;

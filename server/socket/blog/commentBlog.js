const { Models } = require("../../models/AllModel");
const BaiDang = Models.BaiDang;
const ThongBao = Models.ThongBao;
const BinhLuan = Models.BinhLuan;

const CommentBlog = async (io, socket, users, data) => {
  try {
    const { owner, postId, commentBy, content } = data;
    const userSocketId = users[owner]?.socketId;
   // console.log(content);
    // 1. Tạo comment mới
    const comment = new BinhLuan({
      baiDang_id: postId,
      taiKhoan_id: commentBy,
      NoiDung: content,
    });
    await comment.save();

    // 2. Thêm ID của comment vào bài đăng
    await BaiDang.findByIdAndUpdate(postId, {
      $push: { BinhLuan: comment._id },
    });
    if (owner !== commentBy) {
      const TaiKhoan = await Models.TaiKhoan.findById(commentBy, "userName");

      // 3. Tạo thông báo mới
      const notification = new ThongBao({
        TaiKhoan_id: owner,
        fromUser: commentBy,
        fromPost: postId,
        NoiDung: {
          userName: TaiKhoan.userName,
          info: " đã bình luận bài viết của bạn.",
          type: 'post'
        },
      });
      await notification.save();

      // 4. Gửi phản hồi lại cho người dùng
      if (userSocketId) {
        io.to(userSocketId).emit(
          "notify_response",
          `user ${commentBy} commented on your post`
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = CommentBlog;

const { Models } = require("../../models/AllModel");
const BaiDang = Models.BaiDang;
const ThongBao = Models.ThongBao;

const SaveBlog = async (io, socket, users, data) => {
  try {
    const { owner, postId, saveBy } = data;
    // console.log(data)
    const userSocketId = users[owner]?.socketId;

    // 1. Thêm ID người dùng vào thuộc tính SavedBy của bài đăng
    const post = await BaiDang.findById(postId);
    const acc = await Models.TaiKhoan.findById(saveBy);
    if (post) {
      if (!post.SavedBy.includes(saveBy)) {
        post.SavedBy.push(saveBy);
        await post.save();
      }
    }
    if (acc) {
      if (!acc.SavedPosts.includes(postId)) {
        acc.SavedPosts.push(postId);
        await acc.save();
      }
    }
    if (owner !== saveBy) {
      const TaiKhoan = await Models.TaiKhoan.findById(saveBy, "userName");

      // 2. Tạo thông báo mới
      const notification = new ThongBao({
        TaiKhoan_id: owner,
        fromUser: saveBy,
        fromPost: postId,
        NoiDung: {
          userName: TaiKhoan.userName,
          info: " đã lưu bài viết của bạn.",
          type: 'post'
        },
      });
      await notification.save();

      // 3. Gửi phản hồi lại cho người dùng
      if (userSocketId) {
        io.to(userSocketId).emit(
          "notify_response",
          `user ${saveBy} saved your post`
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = SaveBlog;

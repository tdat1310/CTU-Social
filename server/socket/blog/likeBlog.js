const { Models } = require("../../models/AllModel");
const BaiDang = Models.BaiDang;
const ThongBao = Models.ThongBao;

const LikeBlog = async (io, socket, users, data) => {
  try {
    const { owner, postId, likeBy } = data;
   // console.log(data)
    const userSocketId = users[owner]?.socketId;
   // console.log(userSocketId)
    // 1. Thêm ID người dùng vào thuộc tính LikeBy của bài đăng
    const post = await BaiDang.findById(postId);
    if (post) {
      if (!post.LikedBy.includes(likeBy)) {
        post.LikedBy.push(likeBy);
        await post.save();
      }
    }
    if(owner !== likeBy) {
      const TaiKhoan = await Models.TaiKhoan.findById(likeBy, "userName");
      // 2. Tạo thông báo mới
  
      const notification = new ThongBao({
        TaiKhoan_id: owner,
        fromUser: likeBy,
        fromPost: postId,
        NoiDung: {
          userName: TaiKhoan.userName,
          info: ' đã thích bài viết của bạn.',
          type: 'post'
        },
      });
      await notification.save();
  
      // 3. Gửi phản hồi lại cho người dùng
      if (userSocketId) {
        io.to(userSocketId).emit(
          "notify_response",
          `user ${likeBy} like your post`
        );
      }
    }

  } catch (error) {
    console.error(error);
  }
};

module.exports = LikeBlog;

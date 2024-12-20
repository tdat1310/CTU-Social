const { Models } = require("../../models/AllModel");
const BaiDang = Models.BaiDang;
const ThongBao = Models.ThongBao;

const NewBlog = async (io, socket, users, data) => {
  try {
    const { owner, postId } = data;
   

    // 1. Lấy danh sách những người theo dõi của chủ sở hữu bài viết (owner)
    const ownerAccount = await Models.TaiKhoan.findById(owner).populate(
      "NguoiTheoDoi",
      "_id userName"
    );
  
    const post = await BaiDang.findById(postId);
    // console.log(post);
    if (!ownerAccount || post.Group_id) {
      return;
    }

    // 2. Tạo thông báo cho mỗi người theo dõi
    for (let follower of ownerAccount.NguoiTheoDoi) {
      const followerId = follower._id;
      const followerSocketId = users[followerId]?.socketId;

      const notification = new ThongBao({
        TaiKhoan_id: followerId,
        fromUser: owner,
        fromPost: postId,
        NoiDung: {
          userName: ownerAccount.userName,
          info: " vừa đăng một bài viết mới.",
          type: "post"
        },
      });
      await notification.save();

      // 3. Gửi phản hồi lại cho những người theo dõi
      if (followerSocketId) {
        io.to(followerSocketId).emit(
          "notify_response",
          `user ${ownerAccount.userName} just posted a new blog`
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = NewBlog;

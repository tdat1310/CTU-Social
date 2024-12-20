const asyncHandler = require("express-async-handler");
const { Models } = require("../models/AllModel");

const getAllAccount = asyncHandler(async (req, res) => {
  try {
    const TaiKhoan = await Models.TaiKhoan.find({});
    res.status(200).json(TaiKhoan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getSingleDataUser = asyncHandler(async (req, res) => {
  try {
    const { post } = req.query; // Lấy limit từ query parameters

    const TaiKhoan = await Models.TaiKhoan.findById(req.params.id)
      .populate({
        path: "BaiDang",
        match: { Group_id: { $exists: false } }, // Chỉ lấy bài đăng không thuộc nhóm
        options: { limit: parseInt(post) || 10, sort: { createdAt: -1 } }, // Sử dụng limit từ query, mặc định là 10 nếu không có
        populate: [
          {
            path: "BinhLuan",
            populate: {
              path: "taiKhoan_id",
              select: "userName _id avtPic", // Thêm avtPic vào select
              populate: { path: "avtPic" }, // Populate avtPic nếu là tham chiếu
            },
          },
          {
            path: "TaiKhoan_id",
            select: "userName _id avtPic", // Thêm avtPic vào select cho người tạo bài
            populate: { path: "avtPic" }, // Populate avtPic nếu cần
          },
          { path: "DinhKem" },
          { path: "Tags" },
          {
            path: "SavedBy",
            select: "userName _id avtPic", // Thêm avtPic vào select cho người lưu bài viết
            populate: { path: "avtPic" }, // Populate avtPic nếu cần
          },
          {
            path: "LikedBy",
            select: "userName _id avtPic", // Thêm avtPic vào select cho người like bài viết
            populate: { path: "avtPic" }, // Populate avtPic nếu cần
          },
        ],
      })
      .populate({path: "TheoDoi", select: "userName _id avtPic" , populate: {path: 'avtPic'}})
      .populate({path: "NguoiTheoDoi", select: "userName _id avtPic" , populate: {path: 'avtPic'}})
      .populate("TagFollow", "TenTag _id") // Thêm danh sách tag theo dõi
      .populate("avtPic") // Populate avatar chính của tài khoản
      .populate("coverPic"); // Populate ảnh bìa của tài khoản

    if (!TaiKhoan) {
      return res.status(404).json({ message: "User not found" });
    }

    const postCount = await Models.BaiDang.countDocuments({
      TaiKhoan_id: TaiKhoan._id,
      Group_id: { $exists: false }, // Chỉ đếm bài đăng không thuộc nhóm
    });

    res.status(200).json({
      user: TaiKhoan,
      postCount, // Tổng số bài viết
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const commonPostPopulate = [
  {
    path: "BinhLuan",
    populate: {
      path: "taiKhoan_id",
      select: "userName _id avtPic",
      populate: { path: "avtPic" },
    },
  },
  {
    path: "TaiKhoan_id",
    select: "userName _id avtPic",
    populate: { path: "avtPic" },
  },
  { path: "DinhKem" },
  { path: "Tags" },
  {
    path: "SavedBy",
    select: "userName _id avtPic",
    populate: { path: "avtPic" },
  },
  {
    path: "LikedBy",
    select: "userName _id avtPic",
    populate: { path: "avtPic" },
  },
];

const reloadUserData = asyncHandler(async (req, res) => {
  try {
    const TaiKhoan = await Models.TaiKhoan.findById(req.params.id)
      .populate({
        path: "BaiDang",
        match: { Group_id: { $exists: false } },
        populate: commonPostPopulate,
      })
      .populate({ path: "SavedPosts", populate: commonPostPopulate })
      .populate({path: "TheoDoi", select: "userName _id avtPic" , populate: {path: 'avtPic'}})
      .populate({path: "NguoiTheoDoi", select: "userName _id avtPic" , populate: {path: 'avtPic'}})
      .populate("TagFollow")
      .populate("avtPic")
      .populate("coverPic");

    if (!TaiKhoan) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(TaiKhoan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getUserNameById = asyncHandler(async (req, res) => {
  try {
    const TaiKhoan = await Models.TaiKhoan.findById(req.params.id, "userName");

    if (!TaiKhoan) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(TaiKhoan.userName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const removeFollower = asyncHandler(async (req, res) => {
  try {
    const { followerId, followingId } = req.body;

    // In ra dữ liệu yêu cầu để kiểm tra
    console.log(req.body);

    // Tìm người theo dõi và người được theo dõi
    const follower = await Models.TaiKhoan.findById(followerId);
    const following = await Models.TaiKhoan.findById(followingId);

    // Kiểm tra nếu người dùng không tồn tại
    if (!follower || !following) {
      return res.status(404).json({ message: "User not found" });
    }

    // Xóa followingId khỏi danh sách TheoDoi của follower
    const followerIndex = follower.TheoDoi.indexOf(followingId);
    if (followerIndex > -1) {
      follower.TheoDoi.splice(followerIndex, 1);
    }

    // Xóa followerId khỏi danh sách NguoiTheoDoi của following
    const followingIndex = following.NguoiTheoDoi.indexOf(followerId);
    if (followingIndex > -1) {
      following.NguoiTheoDoi.splice(followingIndex, 1);
    }

    // Lưu thay đổi
    await follower.save();
    await following.save();

    res.status(200).json({ message: "Unfollow successful" });
  } catch (error) {
    // Ghi chi tiết lỗi ra console và trả phản hồi lỗi cho người dùng
    console.error("Error removing follower:", error);
    res.status(500).json({ message: error.message });
  }
});
const updateUserInfo = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const { oldPassword, newPassword, userName, email, ...updateData } =
      req.body;
    console.log(req.body);
    // Tìm tài khoản người dùng
    const user = await Models.TaiKhoan.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ field: "userId", message: "User not found" });
    }

    // Kiểm tra xem userName đã tồn tại hay chưa
    if (userName) {
      const existingUserName = await Models.TaiKhoan.findOne({
        userName,
        _id: { $ne: userId },
      });
      if (existingUserName) {
        return res
          .status(400)
          .json({ field: "userName", message: "Username is already taken" });
      }
    }

    // Kiểm tra xem email đã tồn tại hay chưa
    if (email) {
      const existingEmail = await Models.TaiKhoan.findOne({
        email,
        _id: { $ne: userId },
      });
      if (existingEmail) {
        return res
          .status(400)
          .json({ field: "email", message: "Email is already in use" });
      }
    }

    // Kiểm tra mật khẩu cũ
    if (oldPassword && newPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.matKhau);
      if (!isMatch) {
        return res
          .status(400)
          .json({ field: "oldPassword", message: "Old password is incorrect" });
      }

      // Mã hóa mật khẩu mới
      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);
      updateData.matKhau = hashedNewPassword;
    }

    // Cập nhật thông tin người dùng
    const updatedAccount = await Models.TaiKhoan.findByIdAndUpdate(
      userId,
      { $set: { ...updateData, userName, email } },
      { new: true, runValidators: true }
    );

    if (!updatedAccount) {
      return res
        .status(404)
        .json({ field: "update", message: "User not found or update failed" });
    }

    res
      .status(200)
      .json({ message: "User info updated successfully", updatedAccount });
  } catch (error) {
    console.error("Error updating user info:", error);
    res.status(500).json({ field: "server", message: error.message });
  }
});

module.exports = {
  getAllAccount,
  getSingleDataUser,
  reloadUserData,
  getUserNameById,
  removeFollower,
  updateUserInfo,
};

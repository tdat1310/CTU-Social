const asyncHandler = require("express-async-handler");
const { Models } = require("../models/AllModel");
const { deleteFile } = require("../utils/uploadHandle/upload");

const createBaiDang = asyncHandler(async (req, res) => {
  try {
    console.log(req.body);
    const BaiDang = await Models.BaiDang.create(req.body);
    await Models.TaiKhoan.findByIdAndUpdate(
      req.params.user_id,
      { $push: { BaiDang: BaiDang._id } },
      { new: true, useFindAndModify: false }
    );
    res.status(200).json(BaiDang);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});
const getAllPost = asyncHandler(async (req, res) => {
  try {
    const BaiDang = await Models.BaiDang.find({});
    res.status(200).json(BaiDang);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});
const deleteBaiDang = asyncHandler(async (req, res) => {
  const { post_id } = req.params; // Lấy post_id từ body

  try {
    // Tìm bài đăng theo ID và lấy thông tin liên quan
    const baiDang = await Models.BaiDang.findById(post_id).populate(
      "TaiKhoan_id Tags DinhKem"
    );

    if (!baiDang) {
      return res.status(404).json({ message: "Bài đăng không tồn tại" });
    }

    // Lấy thông tin cần thiết từ bài đăng
    const user_id = baiDang.TaiKhoan_id;
    const tag_ids = baiDang.Tags.map((tag) => tag._id);
    const attach_ids = baiDang.DinhKem.map((attach) => attach._id);
    const drive_ids = baiDang.DinhKem.map((attach) => attach.drive_id);

    // Xóa bài đăng
    const deletedBaiDang = await Models.BaiDang.findByIdAndDelete(post_id);
    // Tìm người dùng có theo dõi tag
    const usersFollowTags = await Models.TaiKhoan.find({
      TagFollow: { $in: tag_ids },
    });
    const userSavePost = await Models.TaiKhoan.find({
      SavedPosts: { $in: [post_id] },
    });
    if (usersFollowTags.length > 0) {
      // Pull tag khỏi TagFollow của từng người dùng
      await Promise.all(
        usersFollowTags.map((user) =>
          Models.TaiKhoan.findByIdAndUpdate(
            user._id,
            { $pull: { TagFollow: { $in: tag_ids } } }, // Xóa các tag khỏi trường TagFollow
            { new: true }
          )
        )
      );
    }
    if (userSavePost.length > 0) {
      // Pull tag khỏi TagFollow của từng người dùng
      await Promise.all(
        userSavePost.map((user) =>
          Models.TaiKhoan.findByIdAndUpdate(
            user._id,
            { $pull: { SavedPosts: { $in: [post_id] }} }, // Xóa các tag khỏi trường TagFollow
            { new: true }
          )
        )
      );
    }
    // Cập nhật tài khoản để loại bỏ bài đăng
    await Models.Account.findByIdAndUpdate(
      user_id,
      { $pull: { BaiDang: post_id } },
      { new: true, useFindAndModify: false }
    );

    // Xóa bài đăng khỏi các thẻ liên quan
    await Promise.all(
      tag_ids.map((tag_id) =>
        Models.Tag.findByIdAndUpdate(
          tag_id,
          { $pull: { baiDang_id: post_id } },
          { new: true, useFindAndModify: false }
        )
      )
    );

    // Xóa các tệp đính kèm
    await Promise.all(
      attach_ids.map((attach_id) => Models.DinhKem.findByIdAndDelete(attach_id))
    );

    // Xử lý xóa các tệp từ drive
    await Promise.all(
      drive_ids.map((drive_id) => deleteFile(drive_id)) // Gọi hàm deleteFile cho từng drive_id
    );

    res.status(200).json({ message: "Bài đăng đã được xóa", deletedBaiDang });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
const updateBaiDang = asyncHandler(async (req, res) => {
  const { post_id } = req.params;
  try {
    // Cập nhật dữ liệu bài đăng
    const BaiDang = await Models.BaiDang.findByIdAndUpdate(
      post_id,
      { $set: req.body.data },
      { new: true, useFindAndModify: false }
    );

    // Xóa các tệp đính kèm drive
    await Promise.all(
      req.body.remove_images.map((remove_image) =>
        deleteFile(remove_image.drive_id)
      )
    );
    await Promise.all(
      req.body.remove_files.map((remove_file) =>
        deleteFile(remove_file.drive_id)
      )
    );

    // Xóa các tệp đính kèm khác
    await Promise.all(
      req.body.remove_images.map((attach_id) =>
        Models.DinhKem.findByIdAndDelete(attach_id._id)
      )
    );
    await Promise.all(
      req.body.remove_files.map((attach_id) =>
        Models.DinhKem.findByIdAndDelete(attach_id._id)
      )
    );

    // Lấy danh sách các Tag từ TenTag
    const tags = await Models.Tag.find({
      TenTag: { $in: req.body.remove_tags },
    });

    // Lấy ra danh sách Tag._id
    const tagIds = tags.map((tag) => tag._id);

    // Xóa các Tag._id khỏi BaiDang
    await Models.BaiDang.findByIdAndUpdate(
      post_id,
      {
        $pull: { Tags: { $in: tagIds } }, // Xóa các Tag._id khỏi mảng Tags trong BaiDang
      },
      { new: true }
    );

    // Xóa post_id khỏi các Tag liên quan trong field BaiDang_id
    await Models.Tag.updateMany(
      { _id: { $in: tagIds } }, // Chỉ tìm các Tag theo _id đã lấy ở trên
      { $pull: { BaiDang_id: post_id } } // Xóa post_id khỏi mảng BaiDang_id của các Tag này
    );

    res.status(200).json(BaiDang);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
const getSinglePost = asyncHandler(async (req, res) => {
  const { post_id } = req.params;
  // console.log("fff")
  try {
    const baiDang = await Models.BaiDang.findById(post_id)
      .populate({
        path: "BinhLuan",
        populate: {
          path: "taiKhoan_id",
          select: "userName _id avtPic",
          populate: { path: "avtPic" }, // Populate avtPic
        },
      })
      .populate({
        path: "TaiKhoan_id",
        select: "userName _id avtPic",
        populate: { path: "avtPic" }, // Populate avtPic
      })
      .populate("DinhKem")
      .populate("Tags")
      .populate({
        path: "SavedBy",
        select: "userName _id avtPic",
        populate: { path: "avtPic" }, // Populate avtPic
      })
      .populate("Group_id")
      .populate({
        path: "LikedBy",
        select: "userName _id avtPic",
        populate: { path: "avtPic" }, // Populate avtPic
      });

    if (!baiDang) {
      res.status(404);
      throw new Error("Bài đăng không tồn tại");
    }

    res.status(200).json(baiDang);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
const removeUserFromLikedBy = asyncHandler(async (req, res) => {
  const { post_id, user_id } = req.params;
  try {
    const BaiDang = await Models.BaiDang.findByIdAndUpdate(
      post_id,
      { $pull: { LikedBy: user_id } },
      { new: true, useFindAndModify: false }
    );

    if (!BaiDang) {
      res.status(404);
      throw new Error("Bài đăng không tồn tại");
    }

    res.status(200).json({ message: "User đã được xóa khỏi LikedBy", BaiDang });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
const removeUserFromSavedBy = asyncHandler(async (req, res) => {
  const { post_id, user_id } = req.params;
  try {
    const BaiDang = await Models.BaiDang.findByIdAndUpdate(
      post_id,
      { $pull: { SavedBy: user_id } },
      { new: true, useFindAndModify: false }
    );
    await Models.TaiKhoan.findByIdAndUpdate(
      user_id,
      { $pull: { SavedPosts: post_id } },
      { new: true, useFindAndModify: false }
    );

    if (!BaiDang) {
      res.status(404);
      throw new Error("Bài đăng không tồn tại");
    }

    res.status(200).json({ message: "User đã được xóa khỏi SaveBy", BaiDang });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
const createComment = asyncHandler(async (req, res) => {
  const { post_id, user_id } = req.params;
  try {
    const comment = await Models.BinhLuan.create({
      baiDang_id: post_id,
      taiKhoan_id: user_id,
      NoiDung: req.body.content,
    });
    await Models.BaiDang.findByIdAndUpdate(post_id, {
      $push: { BinhLuan: comment._id },
    });
    res.status(200).json({ comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
const deleteComment = asyncHandler(async (req, res) => {
  const { cmt_id } = req.params;
  try {
    const info = await Models.BinhLuan.findById(cmt_id);
    const comment = await Models.BinhLuan.findByIdAndDelete(cmt_id);
    await Models.BaiDang.findByIdAndUpdate(
      info.baiDang_id,
      { $pull: { BinhLuan: cmt_id } },
      { new: true, useFindAndModify: false }
    );
    res.status(200).json({ comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
const editComment = asyncHandler(async (req, res) => {
  const { cmt_id } = req.params;
  console.log(req.body.content);
  try {
    const comment = await Models.BinhLuan.findByIdAndUpdate(
      cmt_id,
      { NoiDung: req.body.content },
      { new: true } // Return the updated comment
    );
    res.status(200).json({ comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
const searchTags = asyncHandler(async (req, res) => {
  const { query } = req.query;

  try {
    // Tìm kiếm các tags dựa trên từ khóa người dùng nhập
    const tags = await Models.Tag.find({
      TenTag: { $regex: query, $options: "i" }, // Tìm kiếm không phân biệt chữ hoa chữ thường
    }).limit(5); // Giới hạn số lượng kết quả trả về

    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
const getAllPostByTagId = asyncHandler(async (req, res) => {
  const { tag_id } = req.params; // Lấy tag_id từ params
  const limit = parseInt(req.query.post) || 3; // Lấy số lượng bài từ query hoặc mặc định là 10
  // console.log(tag_id);
  try {
    // Tìm tag dựa trên tag_id
    const tenTag = await Models.Tag.findById(tag_id);

    // Nếu không tìm thấy tag, trả về lỗi
    if (!tenTag) {
      return res.status(404).json({ message: "Tag không tồn tại." });
    }

    // Tìm tất cả các bài đăng liên kết với tag_id và đếm tổng số bài
    const totalPosts = await Models.BaiDang.countDocuments({
      Tags: tag_id,
      // Group_id: { $exists: false },
    });

    // Tìm các bài đăng với giới hạn
    const posts = await Models.BaiDang.find({
      Tags: tag_id,
      // Group_id: { $exists: false },
    })
      .limit(limit) // Giới hạn số lượng bài viết
      .populate({
        path: "BinhLuan",
        populate: {
          path: "taiKhoan_id",
          select: "userName _id avtPic",
          populate: { path: "avtPic" }, // Populate avtPic
        },
      })
      .populate({
        path: "TaiKhoan_id",
        select: "userName _id avtPic",
        populate: { path: "avtPic" }, // Populate avtPic
      })
      .populate("DinhKem")
      .populate("Tags")
      .populate({
        path: "SavedBy",
        select: "userName _id avtPic",
        populate: { path: "avtPic" }, // Populate avtPic
      })
      .populate({
        path: "LikedBy",
        select: "userName _id avtPic",
        populate: { path: "avtPic" }, // Populate avtPic
      })
      .populate("Group_id");
    // // Kiểm tra nếu không có bài đăng nào
    // if (!posts || posts.length === 0) {
    //   return res
    //     .status(404)
    //     .json({ message: "Không có bài đăng nào với tag này." });
    // }

    // Trả về danh sách bài đăng cùng với tổng số bài và tên tag
    res.status(200).json({ totalPosts, posts, tenTag: tenTag.TenTag }); // Trả về tổng số bài viết, danh sách bài viết và tag
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
const followTag = asyncHandler(async (req, res) => {
  const { userId, tag_id } = req.body; // Lấy userId và tag_id từ body
  try {
    // Tìm người dùng dựa trên userId
    const user = await Models.TaiKhoan.findById(userId);
    //  console.log(user)
    // Kiểm tra xem người dùng có tồn tại không
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    // Kiểm tra xem tag đã được theo dõi chưa
    if (user.TagFollow.includes(tag_id)) {
      return res.status(200).json({ message: "Bạn đã theo dõi tag này rồi." });
    }

    // Thêm tag_id vào danh sách theo dõi của người dùng
    user.TagFollow.push(tag_id);
    await user.save(); // Lưu thay đổi vào cơ sở dữ liệu

    // Trả về phản hồi thành công
    res
      .status(200)
      .json({ message: "Theo dõi tag thành công!", Tags: user.TagFollow });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
const unfollowTag = asyncHandler(async (req, res) => {
  const { userId, tag_id } = req.body; // Lấy userId và tag_id từ body

  try {
    // Tìm người dùng dựa trên userId
    const user = await Models.TaiKhoan.findById(userId);
    console.log(user);
    // Kiểm tra xem người dùng có tồn tại không
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    // Kiểm tra xem tag có trong danh sách theo dõi không
    if (!user.TagFollow.includes(tag_id)) {
      return res.status(200).json({ message: "Bạn chưa theo dõi tag này." });
    }

    // Xóa tag_id khỏi danh sách theo dõi của người dùng
    user.TagFollow = user.TagFollow.filter((tag) => tag.toString() !== tag_id);
    await user.save(); // Lưu thay đổi vào cơ sở dữ liệu

    // Trả về phản hồi thành công
    res
      .status(200)
      .json({ message: "Hủy theo dõi tag thành công!", Tags: user.TagFollow });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  createBaiDang,
  getAllPost,
  deleteBaiDang,
  updateBaiDang,
  getSinglePost,
  removeUserFromLikedBy,
  removeUserFromSavedBy,
  createComment,
  deleteComment,
  editComment,
  searchTags,
  getAllPostByTagId,
  followTag,
  unfollowTag,
};

const asyncHandler = require("express-async-handler");
const { Models } = require("../models/AllModel");
const { deleteBaiDang } = require("./BaiDangController");
const { deleteFile } = require("../utils/uploadHandle/upload");
const Fuse = require("fuse.js");
const cheerio = require("cheerio");
// Hàm tạo nhóm và bổ sung bản thân là thành viên
const createNhomNguoiDung = asyncHandler(async (req, res) => {
  try {
    const { TruongNhom, TenNhom } = req.body;

    // Tạo nhóm mới
    const newGroup = await Models.NhomNguoiDung.create({
      TruongNhom,
      TenNhom,
      ThanhVien: [TruongNhom], // Thêm người tạo nhóm là thành viên đầu tiên
    });

    // Thêm ID nhóm vào NhomNguoiDung của người tạo nhóm
    await Models.TaiKhoan.findByIdAndUpdate(
      TruongNhom,
      { $addToSet: { NhomNguoiDung: newGroup._id } }, // Dùng $addToSet để tránh trùng lặp
      { new: true }
    );

    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500);
    throw new Error(`Lỗi khi tạo nhóm: ${error.message}`);
  }
});
// Hàm thêm người dùng vào nhóm
const addUserToGroup = asyncHandler(async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    console.log(req.body);
    // Tìm nhóm
    const group = await Models.NhomNguoiDung.findById(groupId);
    if (!group) {
      res.status(404);
      throw new Error("Nhóm không tồn tại");
    }

    // Thêm người dùng vào nhóm
    group.ThanhVien.push(userId);
    await group.save();

    // Cập nhật NhomNguoiDung của TaiKhoan
    await Models.TaiKhoan.findByIdAndUpdate(
      userId,
      { $addToSet: { NhomNguoiDung: groupId } }, // Dùng $addToSet để tránh trùng lặp
      { new: true }
    );
    res.status(200).json(group);
  } catch (error) {
    res.status(500);
    throw new Error(`Lỗi khi thêm người dùng vào nhóm: ${error.message}`);
  }
});
// Lấy danh sách tất cả nhóm
const getAllGroup = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params; // Lấy userId từ request body hoặc từ token đã xác thực
    // console.log(req.body)
    // Tìm tất cả các nhóm mà userId là thành viên
    const groups = await Models.NhomNguoiDung.find({
      ThanhVien: userId,
    }).populate("coverPic");

    // if (!groups || groups.length === 0) {
    //   res.status(404);
    //   throw new Error("Người dùng không tham gia nhóm nào");
    // }
    // console.log(groups)
    res.status(200).json(groups);
  } catch (error) {
    res.status(500);
    throw new Error(
      `Lỗi khi lấy danh sách nhóm của người dùng: ${error.message}`
    );
  }
});
const getGroupDetails = asyncHandler(async (req, res) => {
  try {
    const { group_id } = req.params;
    const limit = parseInt(req.query.post) || 3;

    // Lấy thông tin nhóm
    const groupInfo = await Models.NhomNguoiDung.findById(group_id)
      .populate({
        path: "TruongNhom",
        select: "userName _id avtPic",
        populate: {
          path: "avtPic", // Truy vấn lồng vào ThongTinCaNhan
          select: "", // Lấy các trường trong ThongTin
        },
      })
      .populate({
        path: "ThanhVien",
        select: "userName _id avtPic",
        populate: {
          path: "avtPic", // Truy vấn lồng vào ThongTinCaNhan
          select: "", // Lấy các trường trong ThongTin
        },
      })
      .populate("coverPic");

    // Lấy bài viết trong nhóm
    const groupPost = await Models.BaiDang.find({ Group_id: group_id })
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
      .populate("Group_id")
      .populate({ path: "Tags", select: "TenTag _id" }); // Lấy tên tag và ID của tag

    // Tạo danh sách tệp đính kèm từ các bài viết
    const attachments = {
      postFiles: [],
      postPics: [],
    };

    groupPost.forEach((post) => {
      post.DinhKem.forEach((attachment) => {
        const attachmentInfo = {
          attachmentId: attachment._id,
          url:
            attachment.type === "post-file"
              ? attachment.download_url
              : attachment.display_url,
          name: attachment.name_file,
          type: attachment.type,
          mimeType: attachment.mimeType,
          uploadedBy: {
            userName: post.TaiKhoan_id.userName, // Tên người đăng bài viết
            _id: post.TaiKhoan_id._id, // Email người đăng bài viết
          },
          postId: post._id, // ID bài viết
        };

        // Phân loại tệp đính kèm
        if (attachment.type === "post-file") {
          attachments.postFiles.push(attachmentInfo);
        } else if (attachment.type === "post-pic") {
          attachments.postPics.push(attachmentInfo);
        }
      });
    });

    const totalPosts = await Models.BaiDang.find({ Group_id: group_id });

    // Trả về thông tin nhóm, bài viết và tệp đính kèm
    res.status(200).json({ groupInfo, groupPost, totalPosts, attachments });
  } catch (error) {
    res.status(500);
    throw new Error(`Lỗi khi lấy thông tin nhóm: ${error.message}`);
  }
});
const updateGroupInfo = asyncHandler(async (req, res) => {
  try {
    const { groupId, coverPic, TenNhom, MoTa } = req.body;
    // console.log(req.body)
    // Tìm nhóm cần cập nhật
    const group = await Models.NhomNguoiDung.findById(groupId);
    if (!group) {
      res.status(404);
      throw new Error("Nhóm không tồn tại");
    }
    // Cập nhật thông tin nếu có trong request
    if (coverPic) {
      group.coverPic = coverPic;
    }
    if (TenNhom) {
      group.TenNhom = TenNhom;
    }
    if (MoTa) {
      group.MoTa = MoTa;
    }

    // Lưu thay đổi vào cơ sở dữ liệu
    await group.save();

    res.status(200).json(group);
  } catch (error) {
    res.status(500);
    throw new Error(`Lỗi khi cập nhật thông tin nhóm: ${error.message}`);
  }
});
const getAllPostsFromGroups = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params; // Lấy userId từ request params
    const limit = parseInt(req.query.post) || 3;
    // Lấy tất cả nhóm mà người dùng là thành viên và có thuộc tính group là true
    const groups = await Models.NhomNguoiDung.find({
      ThanhVien: userId, // Kiểm tra người dùng có trong danh sách thành viên
    }).select("_id");

    if (!groups || groups.length === 0) {
      return res.status(200).json({ allPosts: [], total: 0 });
    }

    // Lấy tất cả bài viết thuộc các nhóm này
    const groupIds = groups.map((group) => group._id);
    const total = await Models.BaiDang.find({ Group_id: { $in: groupIds } });
    const allPosts = await Models.BaiDang.find({ Group_id: { $in: groupIds } })
      .populate({
        path: "BinhLuan",
        populate: {
          path: "taiKhoan_id",
          select: "userName _id avtPic",
          populate: { path: "avtPic" },
        },
      })
      .populate({
        path: "TaiKhoan_id",
        select: "userName _id avtPic",
        populate: { path: "avtPic" },
      })
      .populate("DinhKem")
      .populate({
        path: "SavedBy",
        select: "userName _id avtPic",
        populate: { path: "avtPic" },
      })
      .populate({
        path: "LikedBy",
        select: "userName _id avtPic",
        populate: { path: "avtPic" },
      })
      .populate({ path: "Tags", select: "TenTag _id" })
      .populate({
        path: "Group_id",
        select: "TenNhom RoleGroup coverPic ThanhVien TruongNhom _id",
        populate: { path: "coverPic" },
      })
      .limit(limit);

    res.status(200).json({ allPosts, total });
  } catch (error) {
    res.status(500);
    throw new Error(
      `Lỗi khi lấy tất cả bài viết từ nhóm có thuộc tính group là true: ${error.message}`
    );
  }
});
// Hàm xóa nhóm và tất cả bài viết trong nhóm, đồng thời cập nhật các tài khoản liên quan
const deleteGroup = asyncHandler(async (req, res) => {
  try {
    const { groupId, userId } = req.params;

    // Tìm nhóm
    const group = await Models.NhomNguoiDung.findById(groupId).populate(
      "coverPic"
    );
    if (!group) {
      res.status(404);
      throw new Error("Nhóm không tồn tại");
    }
    // if (group.coverPic) deleteFile(group.coverPic.drive_id);
    // Kiểm tra nếu người dùng là trưởng nhóm
    // if (group.TruongNhom.toString() !== userId) {
    //   res.status(403);
    //   throw new Error("Chỉ trưởng nhóm mới có thể xóa nhóm");
    // }

    // Tìm tất cả bài viết của nhóm
    const posts = await Models.BaiDang.find({ Group_id: groupId });

    // Gọi hàm xóa bài đăng cho từng bài viết
    for (const post of posts) {
      await deleteBaiDang({ params: { post_id: post._id } }, res);
    }

    // // Xóa nhóm
    // await Models.NhomNguoiDung.findByIdAndDelete(groupId);

    res
      .status(200)
      .json({ message: "Xóa nhóm và tất cả bài viết liên quan thành công" });
  } catch (error) {
    res.status(500);
    throw new Error(`Lỗi khi xóa nhóm và bài viết: ${error.message}`);
  }
});
// Hàm rời nhóm của người dùng
const leaveGroup = asyncHandler(async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    await Models.NhomNguoiDung.findByIdAndUpdate(
      groupId,
      {
        $pull: { ThanhVien: userId },
      },
      { new: true }
    );
    await Models.NhomNguoiDung.findByIdAndUpdate(
      groupId,
      {
        $pull: { "RoleGroup.accept": userId },
      },
      { new: true }
    );
    await Models.NhomNguoiDung.findByIdAndUpdate(
      groupId,
      {
        $pull: { "RoleGroup.invite": userId },
      },
      { new: true }
    );
    // Xóa các bài viết của người dùng trong nhóm khỏi tài khoản của họ
    const userPosts = await Models.BaiDang.find({
      Group_id: groupId,
      TaiKhoan_id: userId,
    });
    const userPostIds = userPosts.map((post) => post._id);

    await Models.TaiKhoan.findByIdAndUpdate(
      userId,
      {
        $pull: { BaiDang: { $in: userPostIds } },
      },
      { new: true }
    );
    await Models.TaiKhoan.findByIdAndUpdate(
      userId,
      {
        $pull: { NhomNguoiDung: groupId },
      },
      { new: true }
    );

    // Xóa bài viết của người dùng trong nhóm
    await Models.BaiDang.deleteMany({ Group_id: groupId, TaiKhoan_id: userId });

    res.status(200).json({ message: "Người dùng đã rời nhóm thành công" });
  } catch (error) {
    res.status(500);
    throw new Error(`Lỗi khi rời nhóm: ${error.message}`);
  }
});
const updateUserRoleInGroup = asyncHandler(async (req, res) => {
  try {
    const { groupId, userId, action, roleType } = req.body; // action: "add" hoặc "remove"

    // Tìm nhóm
    const group = await Models.NhomNguoiDung.findById(groupId);
    if (!group) {
      res.status(404);
      throw new Error("Nhóm không tồn tại");
    }

    let updateQuery;

    if (roleType === "accept") {
      // Nếu roleType là accept, chỉ có thể thêm hoặc xóa người dùng trong mảng accept
      if (action === "add") {
        // Thêm người dùng vào mảng accept
        updateQuery = { $addToSet: { "RoleGroup.accept": userId } };
      } else if (action === "remove") {
        // Xóa người dùng khỏi mảng accept
        updateQuery = { $pull: { "RoleGroup.accept": userId } };
      } else {
        res.status(400);
        throw new Error("Hành động không hợp lệ");
      }
    } else if (roleType === "invite") {
      // Nếu roleType là invite, chỉ có thể thêm hoặc xóa người dùng trong mảng invite
      if (action === "add") {
        // Thêm người dùng vào mảng invite
        updateQuery = { $addToSet: { "RoleGroup.invite": userId } };
      } else if (action === "remove") {
        // Xóa người dùng khỏi mảng invite
        updateQuery = { $pull: { "RoleGroup.invite": userId } };
      } else {
        res.status(400);
        throw new Error("Hành động không hợp lệ");
      }
    } else {
      res.status(400);
      throw new Error("roleType không hợp lệ");
    }

    // Cập nhật nhóm với hành động tương ứng
    await Models.NhomNguoiDung.findByIdAndUpdate(groupId, updateQuery, {
      new: true,
    });

    const actionMessage =
      action === "add" ? "được thêm vào nhóm" : "được xóa khỏi nhóm";
    res.status(200).json({ message: `Người dùng đã ${actionMessage}` });
  } catch (error) {
    res.status(500);
    throw new Error(`Lỗi khi cập nhật nhóm: ${error.message}`);
  }
});
const searchPostsInGroup = asyncHandler(async (req, res) => {
  try {
    const { keyword = "" } = req.query;
    const { groupId } = req.params;

    // Lấy bài viết thuộc về nhóm cụ thể từ MongoDB
    const posts = await Models.BaiDang.find({ Group_id: groupId })
      .populate({
        path: "TaiKhoan_id",
        select: "userName _id avtPic",
        populate: { path: "avtPic" },
      })
      .populate("Tags")
      .populate("DinhKem");
    console.log(posts);
    // Chuyển đổi nội dung HTML thành văn bản thuần túy trước khi tìm kiếm
    posts.forEach((post) => {
      post.NoiDung = cheerio.load(post.NoiDung).text(); // Loại bỏ thẻ HTML
    });

    // Thiết lập Fuse.js cho bài viết
    const options = {
      keys: ["TieuDe", "NoiDung"],
      threshold: 0.45,
      distance: 999999999999999,
    };

    const fusePosts = new Fuse(posts, options);

    // Thực hiện tìm kiếm trên bài viết
    const foundPosts = fusePosts.search(keyword).map((result) => result.item);

    const searchResults = {
      success: foundPosts.length > 0,
      posts: foundPosts,
    };

    res.status(200).json(searchResults);
  } catch (error) {
    console.error("Error in searchPostsInGroup:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

module.exports = {
  createNhomNguoiDung,
  addUserToGroup,
  getAllGroup,
  getGroupDetails,
  updateGroupInfo,
  getAllPostsFromGroups,
  leaveGroup,
  deleteGroup,
  updateUserRoleInGroup,
  searchPostsInGroup,
};

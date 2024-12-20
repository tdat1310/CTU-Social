const asyncHandler = require("express-async-handler");
const { Models } = require("../models/AllModel");
const cheerio = require("cheerio");
// Hàm tìm kiếm ban đầu - không thay đổi
const getGlobalData = asyncHandler(async (req, res) => {
  try {
    const { post } = req.query;

    // Đếm tổng số bài đăng
    const totalPost = await Models.BaiDang.find({
      Group_id: { $exists: false },
    });

    // Lấy bài đăng theo số lượng
    const postChart = await Models.BaiDang.find({}).populate("TaiKhoan_id");
    const baiDang = await Models.BaiDang.find({ Group_id: { $exists: false } })
      .sort({ createdAt: -1 })
      .limit(parseInt(post))
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
      .populate("Tags")
      .populate({
        path: "SavedBy",
        select: "userName _id avtPic",
        populate: { path: "avtPic" },
      })
      .populate('Group_id')
      .populate({
        path: "LikedBy",
        select: "userName _id avtPic",
        populate: { path: "avtPic" },
      });

    // Lấy dữ liệu các nhóm, người dùng
    const nhomNguoiDung = await Models.NhomNguoiDung.find();
    const taiKhoan = await Models.TaiKhoan.find();

    // Lấy tất cả các tag
    const tags = await Models.Tag.find();

    // Đếm số lượng bài viết cho mỗi tag
    const tagCounts = await Promise.all(
      tags.map(async (tag) => {
        const postCount = await Models.BaiDang.countDocuments({ Tags: tag._id });
        return {
          tag,
          postCount,
        };
      })
    );

    // Sắp xếp theo số lượng bài viết giảm dần và lấy 3 tag có nhiều bài viết nhất
    const topTags = tagCounts
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, 3)
      .map(item => item.tag); // Lấy tag từ kết quả đã sắp xếp

    const globalData = {
      totalPost,
      posts: baiDang,
      groups: nhomNguoiDung,
      users: taiKhoan,
      tags: topTags, // Chỉ sử dụng top 3 tags
      postChart,
    };

    res.status(200).json(globalData);
  } catch (error) {
    console.error("Error in getGlobalData:", error);
    res.status(500).json({ message: error.message });
  }
});


const Fuse = require("fuse.js");

const searchAllData = asyncHandler(async (req, res) => {
  try {
    const { keyword = "" } = req.query;
    if (!keyword) {
      return res.status(400).json({ message: "Keyword is required" });
    }

    // Lấy dữ liệu từ MongoDB trước khi áp dụng Fuse.js
    const [posts, users, tags, groups] = await Promise.all([
      Models.BaiDang.find()
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
        .populate("Tags")
        .populate({
          path: "SavedBy",
          select: "userName _id avtPic",
          populate: { path: "avtPic" },
        })
        .populate({
          path: "LikedBy",
          select: "userName _id avtPic",
          populate: { path: "avtPic" },
        }),
      Models.TaiKhoan.find().select("userName _id avtPic").populate("avtPic"),
      Models.Tag.find(),
      Models.NhomNguoiDung.find().populate("coverPic"),
    ]);

    // Loại bỏ thẻ HTML trong trường NoiDung
    posts.forEach(post => {
      post.NoiDung = cheerio.load(post.NoiDung).text(); // Loại bỏ thẻ HTML
    });

    // Thiết lập Fuse.js cho từng loại dữ liệu
    const options = {
      keys: ["TieuDe", "NoiDung", "userName", "TenTag", "TenNhom"],
      threshold: 0.45,
    };
    console.log(posts)
    const fusePosts = new Fuse(posts, {
      ...options,
      distance: 999999999999999, 
      // keys: ["TieuDe", "NoiDung"],
    });
    const fuseUsers = new Fuse(users, { ...options, keys: ["userName"] });
    const fuseTags = new Fuse(tags, { ...options, keys: ["TenTag"] });
    const fuseGroups = new Fuse(groups, { ...options, keys: ["TenNhom"] });
      
    // Thực hiện tìm kiếm với từ khóa trong từng loại dữ liệu
    const searchResults = {
      posts: fusePosts.search(keyword).map((result) => result.item),
      users: fuseUsers.search(keyword).map((result) => result.item),
      tags: fuseTags.search(keyword).map((result) => result.item),
      groups: fuseGroups.search(keyword).map((result) => result.item),
    };

    res.status(200).json(searchResults);
  } catch (error) {
    console.error("Error in searchAllData:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// Hàm gợi ý
const getSuggestions = asyncHandler(async (req, res) => {
  try {
    const { keyword = "" } = req.query;
    if (!keyword) {
      return res.status(400).json({ message: "Keyword is required" });
    }

    // Lấy dữ liệu từ MongoDB
    const [postSuggestions, userSuggestions, tagSuggestions, groupSuggestions] =
      await Promise.all([
        Models.BaiDang.find().select("TieuDe NoiDung _id"),
        Models.TaiKhoan.find().select("userName _id avtPic").populate("avtPic"),
        Models.Tag.find().select("TenTag _id"),
        Models.NhomNguoiDung.find()
          .select("TenNhom _id coverPic")
          .populate("coverPic"),
      ]);

    // Loại bỏ thẻ HTML trong trường NoiDung
    postSuggestions.forEach((suggestion) => {
      suggestion.NoiDung = cheerio.load(suggestion.NoiDung).text(); // Loại bỏ thẻ HTML
    });
    // Tạo các danh sách gợi ý cho Fuse.js với định dạng phù hợp
    const postItems = postSuggestions.map((suggestion) => ({
      type: "post",
      name: suggestion.TieuDe,
      content: suggestion.NoiDung, // Thêm trường NoiDung vào đối tượng
      id: suggestion._id,
    }));
    const userItems = userSuggestions.map((suggestion) => ({
      type: "user",
      name: suggestion.userName,
      id: suggestion._id,
      avtPic: suggestion.avtPic,
    }));
    const tagItems = tagSuggestions.map((suggestion) => ({
      type: "tag",
      name: suggestion.TenTag,
      id: suggestion._id,
    }));
    const groupItems = groupSuggestions.map((suggestion) => ({
      type: "group",
      name: suggestion.TenNhom,
      id: suggestion._id,
      coverPic: suggestion.coverPic,
    }));
  
    // Gộp tất cả gợi ý lại thành một danh sách duy nhất
    const combinedSuggestions = [
      ...postItems,
      ...userItems,
      ...tagItems,
      ...groupItems,
    ];

    // Thiết lập Fuse.js với các tùy chọn tìm kiếm và độ chính xác
    const fuseOptions = {
      keys: ["name", "content"], // Tìm kiếm trong cả 'name' và 'content'
      threshold: 0.45,
      distance: 999999999999999,
    };
    const fuse = new Fuse(combinedSuggestions, fuseOptions);

    // Thực hiện tìm kiếm và lấy tối đa 5 gợi ý
    const results = fuse
      .search(keyword)
      .slice(0, 5)
      .map((result) => result.item);

    res.status(200).json(results);
  } catch (error) {
    console.error("Error in getSuggestions:", error);
    res.status(500).json({ message: error.message });
  }
});


const findUsersByMutualFollowers = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params; // ID của người dùng hiện tại
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Lấy thông tin người dùng hiện tại (bao gồm danh sách người đang theo dõi)
    const currentUser = await Models.TaiKhoan.findById(userId).select("TheoDoi");
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const { TheoDoi } = currentUser; // Danh sách ID người dùng mà `userId` đang theo dõi

    if (!TheoDoi.length) {
      return res.status(200).json([]); // Nếu không theo dõi ai, trả về mảng rỗng
    }

    // Lấy danh sách tất cả người dùng
    const allUsers = await Models.TaiKhoan.find()
      .select("_id userName TheoDoi avtPic")
      .populate("avtPic");

    // Lọc người dùng tiềm năng (không phải bản thân `userId` và chưa được follow)
    const potentialUsers = allUsers.filter(
      (user) => user._id.toString() !== userId && !TheoDoi.includes(user._id.toString())
    );

    // Tìm số lượng người theo dõi chung cho từng người dùng tiềm năng
    const suggestedUsers = await Promise.all(
      potentialUsers.map(async (user) => {
        // Tính danh sách người theo dõi chung
        const mutualFollowers = await Models.TaiKhoan.find({
          _id: { $in: user.TheoDoi.filter((followedId) => TheoDoi.includes(followedId.toString())) },
        }).select("_id userName avtPic").populate("avtPic");

        return {
          _id: user._id,
          userName: user.userName,
          avtPic: user.avtPic,
          mutualFollowersCount: mutualFollowers.length, // Số lượng người theo dõi chung
          mutualFollowers: mutualFollowers, // Chi tiết danh sách người theo dõi chung
        };
      })
    );

    // Chỉ giữ những người dùng có theo dõi chung
    const filteredSuggestedUsers = suggestedUsers.filter((user) => user.mutualFollowersCount > 0);

    res.status(200).json(filteredSuggestedUsers);
  } catch (error) {
    console.error("Error in getUnfollowedUsersWithMutuals:", error);
    res.status(500).json({ message: error.message });
  }
});


module.exports = {
  getGlobalData, // Hàm ban đầu không thay đổi
  searchAllData, // Hàm tìm kiếm tổng hợp đã cập nhật
  getSuggestions,
  findUsersByMutualFollowers
};

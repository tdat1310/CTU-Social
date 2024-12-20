const asyncHandler = require("express-async-handler");
const { Models } = require("../models/AllModel");

const createTag = asyncHandler(async (req, res) => {
  try {
    const { TenTag } = req.body; // Lấy TenTag từ body
    const { post_id } = req.params; // Lấy Post_id từ tham số URL

    // Kiểm tra xem tag có tồn tại hay không
    let existingTag = await Models.Tag.findOne({ TenTag });
    if (existingTag) {
      // Nếu tag đã tồn tại, bổ sung Post_id vào mảng Tags của BaiDang
      await Models.BaiDang.updateOne(
        { _id: post_id },
        { $addToSet: { Tags: existingTag._id } } // Thêm ID của tag vào mảng Tags
      );

      // Cập nhật baiDang_id của tag
      await Models.Tag.updateOne(
        { _id: existingTag._id },
        { $addToSet: { baiDang_id: post_id } } // Thêm Post_id vào mảng baiDang_id của tag
      );

      return res.status(200).json(existingTag); // Trả về tag đã tồn tại
    }

    // Nếu tag chưa tồn tại, tạo tag mới
    const newTag = await Models.Tag.create({
      TenTag: TenTag,
      baiDang_id: [post_id], // Tạo mảng baiDang_id với Post_id
    });
    
    // Bổ sung ID của tag mới vào mảng Tags của BaiDang
    await Models.BaiDang.updateOne(
      { _id: post_id },
      { $addToSet: { Tags: newTag._id } } // Thêm ID của tag mới vào mảng Tags
    );

    return res.status(201).json(newTag); // Trả về tag mới được tạo
  } catch (error) {
    res.status(500).json({ message: error.message }); // Trả về lỗi nếu có
  }
});

const getAllTag = asyncHandler(async (req, res) => {
  try {
    const Tag = await Models.Tag.find({});
    res.status(200).json(Tag);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

module.exports = {
  createTag,
  getAllTag
};

const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { Models } = require("../models/AllModel");

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { userName, email, userPassword } = req.body;

    // Kiểm tra trùng userName
    const existingUserName = await Models.TaiKhoan.findOne({ userName });
    if (existingUserName) {
      return res
        .status(200)
        .json({ error: { type: "userName", des: "Username đã tồn tại" } });
    }

    // Kiểm tra trùng email
    const existingEmail = await Models.TaiKhoan.findOne({ email });
    if (existingEmail) {
      return res
        .status(200)
        .json({ error: { type: "email", des: "Email đã tồn tại" } });
    }

    // Nếu không trùng, tạo mới tài khoản
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(userPassword, salt);

    // Tạo tài khoản với các thuộc tính trống hoặc mặc định
    const TaiKhoan = await Models.TaiKhoan.create({
      userName: userName,
      email: email,
      password: hashed,
      avtPic: null,  // Để trống ảnh đại diện
      coverPic: null,  // Để trống ảnh bìa
      ChuyenNganh: "",  // Để trống chuyên ngành
      Khoa: null,  // Để trống khóa học
    });

    // Trả về thông tin tài khoản, không bao gồm password
    const { password, ...others } = TaiKhoan._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    // Tìm tài khoản dựa trên email
    const TaiKhoan = await Models.TaiKhoan.findOne({
      email: req.body.email,
    })
      .populate("TheoDoi", "userName _id") // Thêm danh sách người theo dõi (followers)
      .populate("NguoiTheoDoi", "userName _id") // Thêm danh sách theo dõi
      .populate("TagFollow", "TenTag _id"); // Thêm danh sách tag đang theo dõi

    if (!TaiKhoan) {
      return res
        .status(200)
        .json({ error: { type: "email", des: "Email người dùng sai" } });
    }

    // So sánh mật khẩu
    const validPassword = await bcrypt.compare(
      req.body.userPassword,
      TaiKhoan.password
    );
    if (!validPassword) {
      return res
        .status(200)
        .json({ error: { type: "userPassword", des: "Mật khẩu người dùng sai" } });
    }

    // Trả về thông tin tài khoản, không bao gồm password
    const { password, ...others } = TaiKhoan._doc;
    res.status(200).json({ ...others, error: "" });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

module.exports = {
  registerUser,
  loginUser,
};

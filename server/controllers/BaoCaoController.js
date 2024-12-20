const asyncHandler = require("express-async-handler");
const { Models } = require("../models/AllModel");
const Fuse = require("fuse.js");
// Hàm lấy tất cả báo cáo với thông tin chi tiết bài viết và chỉ lấy TaiKhoan_id trong BaiViet_id
const getAllReports = asyncHandler(async (req, res) => {
  try {
    const { searchQuery = "", page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Lấy tất cả báo cáo
    let reports = await Models.BaoCao.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "Reporter",
        select: "userName _id avtPic",
        populate: { path: "avtPic" },
      })
      .populate("ownerPost")
      .populate({
        path: "BaiViet_id",
        populate: [
          {
            path: "TaiKhoan_id",
            select: "userName _id avtPic",
            populate: { path: "avtPic" },
          },
          { path: "DinhKem" },
        ],
      })
      .populate({
        path: "Nhom_id",
        select: "TenNhom _id coverPic",
        populate: { path: "coverPic" },
      });

    // Nếu có searchQuery, lọc dữ liệu bằng Fuse.js
    if (searchQuery) {
      const fuse = new Fuse(reports, {
        keys: ["Reporter.userName", "Nhom_id.TenNhom", "NoiDung"],
        threshold: 0.4,
      });
      reports = fuse.search(searchQuery).map((result) => result.item);
    }

    // Tổng số báo cáo sau khi lọc
    const totalReports = reports.length;

    // Phân trang kết quả
    const paginatedReports = reports.slice(skip, skip + limit);
    res.status(200).json({
      reports: paginatedReports,
      totalReports,
      totalPages: Math.ceil(totalReports / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Lỗi khi lấy báo cáo:", error);
    res.status(500).json({ message: error.message });
  }
});
// Hàm khóa tài khoản
const lockAccount = asyncHandler(async (req, res) => {
  try {
    const { accountId, action } = req.body; // Lấy accountId từ tham số URL

    // Tìm tài khoản theo ID và cập nhật trường Blocked
    const account = await Models.TaiKhoan.findByIdAndUpdate(
      accountId,
      { Blocked: action == "block" ? true : false }, // Cập nhật trường Blocked thành true
      { new: true } // Trả về tài khoản đã được cập nhật
    );

    if (!account) {
      return res.status(404).json({ message: "Tài khoản không tồn tại." });
    }

    res.status(200).json({
      message: "Tài khoản đã được thuc thi thành công.",
      account,
    });
  } catch (error) {
    console.error("Lỗi khi khóa tài khoản:", error);
    res.status(500).json({ message: error.message });
  }
});
const updateReportStatus = asyncHandler(async (req, res) => {
  try {
    const { reportId } = req.body; // Lấy reportId và newState từ yêu cầu

    // Tìm báo cáo theo ID và cập nhật trường state
    const report = await Models.BaoCao.findByIdAndUpdate(
      reportId,
      { state: true }, // Cập nhật trường state
      { new: true } // Trả về báo cáo đã được cập nhật
    );

    if (!report) {
      return res.status(404).json({ message: "Báo cáo không tồn tại." });
    }

    res.status(200).json({
      message: "Trạng thái báo cáo đã được cập nhật thành công.",
      report,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái báo cáo:", error);
    res.status(500).json({ message: error.message });
  }
});
// Hàm lấy tất cả tài khoản với phân trang
const getAllAccounts = asyncHandler(async (req, res) => {
  try {
    const { searchQuery = "", page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let accounts = await Models.TaiKhoan.find();

    // Nếu có searchQuery, lọc dữ liệu bằng Fuse.js
    if (searchQuery) {
      const fuse = new Fuse(accounts, { keys: ["userName"], threshold: 0.4 });
      accounts = fuse.search(searchQuery).map((result) => result.item);
    }

    // Tổng số tài khoản sau khi lọc
    const totalAccounts = accounts.length;

    // Phân trang kết quả
    const paginatedAccounts = accounts.slice(skip, skip + limit);
    res.status(200).json({
      accounts: paginatedAccounts,
      totalAccounts,
      totalPages: Math.ceil(totalAccounts / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Lỗi khi lấy tất cả tài khoản:", error);
    res.status(500).json({ message: error.message });
  }
});
const deleteReport = asyncHandler(async (req, res) => {
  try {
    const { reportIds } = req.body; // Lấy mảng reportIds từ yêu cầu
    console.log(reportIds);
    if (!Array.isArray(reportIds) || reportIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Danh sách reportIds không hợp lệ." });
    }

    // Xóa tất cả báo cáo có ID trong mảng reportIds
    const result = await Models.BaoCao.deleteMany({ _id: { $in: reportIds } });

    res.status(200).json({
      message: "Các báo cáo đã được xóa thành công.",
      deletedCount: result.deletedCount, // Số lượng báo cáo đã xóa
    });
  } catch (error) {
    console.error("Lỗi khi xóa nhiều báo cáo:", error);
    res.status(500).json({ message: error.message });
  }
});

// Hàm tạo báo cáo
const createReport = asyncHandler(async (req, res) => {
  try {
    const { Reporter, BaiViet_id, Nhom_id, NoiDung, ownerPost } = req.body;

    // Kiểm tra thông tin bắt buộc
    if (!Reporter || !BaiViet_id || !NoiDung) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc." });
    }

    // Tạo báo cáo mới
    const newReport = new Models.BaoCao({
      Reporter,
      BaiViet_id,
      Nhom_id,
      NoiDung,
      ownerPost,
    });

    // Lưu báo cáo vào cơ sở dữ liệu
    await newReport.save();

    res.status(201).json({
      message: "Tạo báo cáo thành công.",
      report: newReport,
    });
  } catch (error) {
    console.error("Lỗi khi tạo báo cáo:", error);
    res.status(500).json({ message: error.message });
  }
});
module.exports = {
  getAllReports,
  lockAccount,
  updateReportStatus,
  getAllAccounts,
  deleteReport,
  createReport,
};

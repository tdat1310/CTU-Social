const asyncHandler = require("express-async-handler");
const { Models } = require("../models/AllModel");

const createThongBao = asyncHandler(async (req, res) => {
  try {
    const ThongBao = await Models.ThongBao.create(req.body);
    res.status(200).json(ThongBao);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const getThongBaoByTaiKhoanId = asyncHandler(async (req, res) => {
  try {
    const { user_id } = req.params;
    const thongBaoList = await Models.ThongBao.find({
      TaiKhoan_id: user_id,
    }).populate("fromPost")

    if (!thongBaoList || thongBaoList.length === 0) {
      res.status(200).json([]);
    } else {
      res.status(200).json(thongBaoList);
    }
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const updateSeenStatus = asyncHandler(async (req, res) => {
  try {
    const { user_id } = req.params;

    await Models.ThongBao.updateMany(
      { TaiKhoan_id: user_id, seen: false },
      { $set: { seen: true } }
    );

    const updatedThongBaoList = await Models.ThongBao.find({
      TaiKhoan_id: user_id,
    }).populate("fromPost");

    if (!updatedThongBaoList || updatedThongBaoList.length === 0) {
      res.status(200).json({ message: "Không có thông báo nào." });
    } else {
      res.status(200).json(updatedThongBaoList);
    }
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// Hàm để xóa thông báo dựa trên ID thông báo và ID người dùng
const deleteThongBaoById = asyncHandler(async (req, res) => {
  try {
    const { user_id } = req.params;

    const deletedThongBao = await Models.ThongBao.deleteMany({
      TaiKhoan_id: user_id,
    });

    if (!deletedThongBao) {
      res.status(404).json({ message: "Không tìm thấy thông báo nào." });
    } else {
      res
        .status(200)
        .json({ message: "Đã xóa thông báo thành công.", deletedThongBao });
    }
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});
const removeNotificationById = asyncHandler(async (req, res) => {
  try {
    const { notify_id } = req.params; // Nhận ID thông báo từ params

    const deletedThongBao = await Models.ThongBao.findByIdAndDelete(notify_id); // Tìm và xóa thông báo theo ID

    if (!deletedThongBao) {
      res.status(404).json({ message: "Không tìm thấy thông báo." });
    } else {
      res
        .status(200)
        .json({ message: "Đã xóa thông báo thành công.", deletedThongBao });
    }
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

module.exports = {
  createThongBao,
  getThongBaoByTaiKhoanId,
  updateSeenStatus,
  deleteThongBaoById, // Export hàm xóa thông báo
  removeNotificationById,
};

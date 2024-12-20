const asyncHandler = require("express-async-handler");
const mime = require("mime-types");
const { uploadFile, deleteFile } = require("../utils/uploadHandle/upload");
const clearFolder = require("../utils/uploadHandle/folder");
const { Models } = require("../models/AllModel");

const createDinhKem = asyncHandler(async (req, res) => {
  try {
    const file = req.file;
    const username = req.body.userName;
    const type = req.body.type;

    if (!file) {
      throw new Error("File không tồn tại");
    }

    // Upload the file
    const data = await uploadFile(
      file.path,
      mime.lookup(file.path),
      file.originalname,
      type
    );

    // Prepare the attachment data
    let DinhKemData = {
      display_url: data.display_url,
      name_file: file.originalname,
      drive_file_id: data.fileID,
      mimeType: data.mimetype,
      type: type,
      download_url: data.download_url,
    };

    // Handling different types of attachments
    if (type === "post-pic" || type === "post-file") {
      DinhKemData.BaiDang_id = req.params.post_id;
      // Save the attachment and add it to the post
      const DinhKem = await Models.DinhKem.create(DinhKemData);
      await Models.BaiDang.findByIdAndUpdate(
        req.params.post_id,
        { $addToSet: { DinhKem: DinhKem._id } },
        { new: true, useFindAndModify: false }
      );
      res.status(200).json(DinhKem);
    } else if (type === "chat-pic" || type === "chat-file") {
      // Create a message in TinNhan and attach the file
      const newMessage = await Models.TinNhan.create({
        NoiDung: "This is a placeholder for the message",
        NguoiGui_id: req.body.NguoiGui_id,
        NhomChat_id: req.params.room_id,
        file: null,
        seen: [],
      });

      // Attach the file to the message
      DinhKemData.TinNhan_id = newMessage._id;
      const DinhKem = await Models.DinhKem.create(DinhKemData);
      newMessage.file = DinhKem._id;
      await newMessage.save();

      // Update the NhomChat with the new message
      await Models.NhomChat.findByIdAndUpdate(
        req.params.room_id,
        { $addToSet: { TinNhan: newMessage._id } },
        { new: true, useFindAndModify: false }
      );

      res.status(200).json(DinhKem);
    } else if (type === "user") {
      DinhKemData.TaiKhoan_id = req.params.acc_id;
      const DinhKem = await Models.DinhKem.create(DinhKemData);
      res.status(200).json(DinhKem);
    } else if (type === "group") {
      // Handling the case where type is "group"
      DinhKemData.NhomNguoiDung_id = req.params.group_id;
      const DinhKem = await Models.DinhKem.create(DinhKemData);

      res.status(200).json(DinhKem);
    } else {
      res.status(400).json({ message: "Loại tệp không hợp lệ" });
    }

    // Clear the upload folder
    clearFolder(
      `D:/CTU SOCIAL/server/utils/uploadHandle/uploads/${username}/${type}/`
    );
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});


const deleteDinhKem = asyncHandler(async (req, res) => {
  try {
    const { attach_id } = req.params;

    await Models.DinhKem.findByIdAndDelete(attach_id);

    deleteFile(req.body.drive_file_id);

    res.status(200).json({ message: "Đính kèm đã được xóa thành công" });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

module.exports = { createDinhKem, deleteDinhKem };

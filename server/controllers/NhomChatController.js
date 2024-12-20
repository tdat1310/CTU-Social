const asyncHandler = require("express-async-handler");
const { Models } = require("../models/AllModel");

const createNhomChat = asyncHandler(async (req, res) => {
  try {
    const nhomChat = await Models.NhomChat.create(req.body);
    res.status(200).json(nhomChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getAllMessage = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Find the chat group and populate the TinNhan property along with the file
    const nhomChat = await Models.NhomChat.findById(id)
      .populate({
        path: "TinNhan",
        populate: {
          path: "file",
          select: "", // This will include all fields of the file document
        },
      });

    if (!nhomChat) {
      res.status(404).json({ message: "Chat group not found" });
      return;
    }

    console.log("Populated NhomChat:", nhomChat);
    res.status(200).json(nhomChat.TinNhan);
  } catch (error) {
    console.error("Error in getAllMessage:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  createNhomChat,
  getAllMessage,
};

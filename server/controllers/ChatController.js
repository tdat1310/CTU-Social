const asyncHandler = require("express-async-handler");
const { Models } = require("../models/AllModel");
const { deleteFile } = require("../utils/uploadHandle/upload");
const createOrFindRoomChat = asyncHandler(async (req, res) => {
  const { userId, otherUserId } = req.body;

  try {
    // Tìm nhóm chat giữa hai người dùng
    let roomChat = await Models.NhomChat.findOne({
      type: "user",
      ThanhVien: { $all: [userId, otherUserId] },
    });

    // Nếu chưa tồn tại, tạo nhóm chat mới
    if (!roomChat) {
      roomChat = await Models.NhomChat.create({
        ThanhVien: [userId, otherUserId],
      });

      // Thêm ID của nhóm chat vào thuộc tính NhomChat trong model TaiKhoan
      await Models.TaiKhoan.updateMany(
        { _id: { $in: [userId, otherUserId] } },
        { $addToSet: { NhomChat: roomChat._id } }
      );

      return res.status(200).json({
        status: "new",
        room_id: roomChat._id,
      });
    }

    // Nếu nhóm chat đã tồn tại, vẫn đảm bảo ID nhóm chat đã được thêm vào TaiKhoan
    await Models.TaiKhoan.updateMany(
      { _id: { $in: [userId, otherUserId] } },
      { $addToSet: { NhomChat: roomChat._id } }
    );

    res.status(200).json({
      status: "old",
      room_id: roomChat._id,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const getUserRooms = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.userId; // Lấy user ID từ tham số request

    // Lấy tất cả room mà người dùng tham gia
    const userRooms = await Models.NhomChat.find({
      ThanhVien: { $in: [userId] },
    }).populate({
      path: "ThanhVien",
      select: "userName _id avtPic", // Chỉ lấy UserName và _id
      populate: "avtPic"
    });

    const processedRooms = await Promise.all(
      userRooms.map(async (room) => {
        let latestMsg = null;

        // Lấy tin nhắn mới nhất theo room._id và populate thuộc tính file
        latestMsg = await Models.TinNhan.findOne({ NhomChat_id: room._id })
          .sort({ createdAt: -1 })
          .populate({
            path: "file", // Populate thêm thuộc tính file
            select: "", // Chỉ lấy các trường cần thiết của file
          })
          .exec();

        if (room.type === "user") {
          // Nếu là type user, lọc ra người dùng còn lại (trừ người dùng hiện tại)
          const otherUser = room.ThanhVien.find(
            (member) => member._id.toString() !== userId
          );
          return {
            _id: room._id,
            otherUser, // Trả về người dùng còn lại
            latestMsg, // Thêm tin nhắn mới nhất kèm theo file
            type: "user",
            createdAt: room.createdAt,
          };
        } else if (room.type === "group") {
          // Nếu là type group, lấy thêm thuộc tính groupChatName mà không cần populate
          const otherUser = room.ThanhVien.filter(
            (member) => member._id.toString() !== userId
          );
          return {
            _id: room._id,
            groupChatName: room.groupChatName,
            latestMsg,
            otherUser, // Thêm tin nhắn mới nhất kèm theo file
            type: "group",
            createdAt: room.createdAt,
          };
        }
      })
    );
    res.status(200).json(processedRooms);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const getAllMessage = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)
    // Find the chat group and populate the TinNhan property
    const nhomChat = await Models.NhomChat.findById(id).populate({
      path: "TinNhan",
      populate: [
        {
          path: "file",
          select: "", // Bao gồm tất cả các trường của file
        },
        {
          path: "NguoiGui_id",
          select: "", 
          populate: {
            path: 'avtPic',
            select: "",
          }
        },
      ],
    });
     // Simple populate without additional fields

    if (!nhomChat) {
      res.status(404);
      throw new Error("Chat group not found");
    }

    res.status(200).json(nhomChat.TinNhan);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// Hàm tạo nhóm chat kiểu group
const createGroupChat = asyncHandler(async (req, res) => {
  const { userId, groupChatName, memberIds } = req.body; // memberIds là danh sách ObjectId của các thành viên khác
  console.log(req.body);

  try {
    // Kiểm tra xem nhóm chat với tên đã cho có tồn tại không
    let roomChat = await Models.NhomChat.findOne({
      type: "group",
      groupChatName: groupChatName,
    });

    // Nếu chưa tồn tại, tạo nhóm chat mới
    if (!roomChat) {
      // Thêm người tạo vào danh sách thành viên
      const members = [userId, ...memberIds];

      roomChat = await Models.NhomChat.create({
        type: "group",
        ThanhVien: members, // Danh sách thành viên bao gồm người tạo và các thành viên khác
        groupChatName: groupChatName,
      });

      // Cập nhật ID nhóm chat vào thuộc tính NhomChat trong model TaiKhoan cho tất cả thành viên
      await Models.TaiKhoan.updateMany(
        { _id: { $in: members } }, // Cập nhật cho tất cả thành viên
        { $addToSet: { NhomChat: roomChat._id } }
      );

      return res.status(200).json({
        status: "new",
        room_id: roomChat._id,
      });
    }

    // Nếu nhóm chat đã tồn tại, trả về kết quả
    return res.status(200).json({
      status: "old",
      room_id: roomChat._id,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const getUnseenMessageCount = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    // Tìm tất cả các phòng mà người dùng tham gia
    const userRooms = await Models.NhomChat.find({
      ThanhVien: { $in: [userId] },
    });

    // Tạo một mảng chứa số tin nhắn chưa xem trong từng phòng
    const unseenMessageCounts = await Promise.all(
      userRooms.map(async (room) => {
        // Đếm số tin nhắn chưa xem (chưa có userId trong mảng seen)
        const count = await Models.TinNhan.countDocuments({
          NhomChat_id: room._id,
          NguoiGui_id: { $ne: userId }, // Tin nhắn không phải từ người dùng hiện tại
          seen: { $ne: userId }, // Người dùng chưa xem tin nhắn
        });

        return { id: room._id, count };
      })
    );

    // Trả về kết quả là một mảng các object với {id, count}
    res.status(200).json(unseenMessageCounts);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const markAllMessagesAsSeen = asyncHandler(async (req, res) => {
  try {
    const { userId, roomId, seenUser } = req.body;
    console.log(req.body)
    // Tìm room theo ID
    const room = await Models.NhomChat.findById(roomId);

    if (!room) {
      res.status(404);
      throw new Error("Room not found");
    }

    // Cập nhật tin nhắn trong phòng chat, thêm người dùng vào mảng seen nếu chưa có
    const result = await Models.TinNhan.updateMany(
      {
        NhomChat_id: roomId,
        NguoiGui_id: { $ne: userId }, // Không phải tin nhắn do người dùng gửi
        seen: { $ne: userId }, // Chưa có người dùng này trong mảng seen
      },
      { $addToSet: { seen: userId } } // Thêm seenUser vào mảng seen
    );
    console.log(result)
    res.status(200).json({
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});
const editGroupChatName = asyncHandler(async (req, res) => {
  const { roomId, newGroupChatName } = req.body;

  try {
    // Tìm phòng chat theo ID
    const roomChat = await Models.NhomChat.findById(roomId);

    if (!roomChat) {
      res.status(404);
      throw new Error("Chat group not found");
    }

    // Cập nhật tên nhóm chat
    roomChat.groupChatName = newGroupChatName;
    await roomChat.save();

    res.status(200).json({
      status: "success",
      room_id: roomChat._id,
      groupChatName: roomChat.groupChatName,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const deleteBoxChat = asyncHandler(async (req, res) => {
  const { roomId } = req.body;

  try {
    // Tìm phòng chat và lấy danh sách thành viên
    const room = await Models.NhomChat.findById(roomId);
    if (!room) {
      res.status(404);
      throw new Error("Room not found");
    }

    const members = room.ThanhVien; // Lấy danh sách thành viên

    // Tìm tất cả tin nhắn trong boxchat
    const messages = await Models.TinNhan.find({ NhomChat_id: roomId });

    // Sử dụng Promise.all để xử lý xóa file và tin nhắn song song
    const deleteMessagePromises = messages.map(async (message) => {
      // Nếu tin nhắn có file đính kèm
      if (message.file) {
        // Tìm đính kèm và lấy drive_file_id để xóa
        const attachment = await Models.DinhKem.findById(message.file);
        if (attachment && attachment.drive_file_id) {
          // Xóa file khỏi Google Drive và đính kèm
          await deleteFile(attachment.drive_file_id);
          await Models.DinhKem.findByIdAndDelete(message.file);
        }
      }
      // Xóa tin nhắn
      return Models.TinNhan.findByIdAndDelete(message._id);
    });

    // Chờ tất cả tin nhắn và file được xử lý
    await Promise.all(deleteMessagePromises);

    // Sử dụng Promise.all để xóa roomId trong mảng NhomChat của tất cả thành viên
    const removeFromMembersPromises = members.map(async (memberId) => {
      return Models.TaiKhoan.findByIdAndUpdate(memberId, {
        $pull: { NhomChat: roomId },
      });
    });

    // Chờ tất cả thành viên được cập nhật
    await Promise.all(removeFromMembersPromises);

    // Xóa hẳn boxchat
    await Models.NhomChat.findByIdAndDelete(roomId);

    res
      .status(200)
      .json({ message: "BoxChat và dữ liệu liên quan đã được xóa thành công" });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});
const deleteSingleMessage = asyncHandler(async (req, res) => {
  const { messageId, roomId } = req.body;

  try {
    // Tìm tin nhắn theo messageId
    const message = await Models.TinNhan.findById(messageId);
    if (!message) {
      res.status(404);
      throw new Error("Message not found");
    }

    // Nếu tin nhắn có file đính kèm
    if (message.file) {
      // Tìm file đính kèm
      const attachment = await Models.DinhKem.findById(message.file);
      if (attachment && attachment.drive_file_id) {
        // Xóa file khỏi Google Drive và bản ghi file
        await deleteFile(attachment.drive_file_id);
        await Models.DinhKem.findByIdAndDelete(message.file);
      }
    }

    // Xóa tin nhắn
    await Models.TinNhan.findByIdAndDelete(messageId);

    // Xóa messageId khỏi room chat (box chat)
    await Models.NhomChat.findByIdAndUpdate(roomId, {
      $pull: { TinNhan: messageId }, // Loại bỏ messageId khỏi mảng TinNhan của box chat
    });

    res
      .status(200)
      .json({ message: "Tin nhắn và file đính kèm đã được xóa thành công" });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});
const addMemberToGroupChat = asyncHandler(async (req, res) => {
  const { roomId, memberIds, userId } = req.body; // userId là ID của người dùng hiện tại

  try {
    // Tìm nhóm chat theo roomId
    const roomChat = await Models.NhomChat.findById(roomId);

    if (!roomChat) {
      return res.status(404).json({ message: "Group chat not found" });
    }

    // Kiểm tra loại group chat
    if (roomChat.type !== "group") {
      return res.status(400).json({ message: "This is not a group chat" });
    }

    // Lấy danh sách các thành viên hiện tại của nhóm
    const currentMembers = roomChat.ThanhVien.map((member) => member.toString());

    // Loại trừ userId (người dùng hiện tại) khỏi danh sách memberIds
    const filteredMemberIds = memberIds.filter((memberId) => memberId !== userId);

    // Tách danh sách thành viên mới và thành viên đã có
    const newMembers = filteredMemberIds.filter((memberId) => !currentMembers.includes(memberId));
    const existingMembers = filteredMemberIds.filter((memberId) => currentMembers.includes(memberId));

    // Nếu không có thành viên mới thì trả về ngay
    if (newMembers.length === 0) {
      return res.status(200).json({
        message: "All members are already in the group chat or no new members provided",
        existingMembers, // Thành viên đã có trong nhóm
        newMembers: [],  // Không có thành viên mới
      });
    }

    // Thêm các thành viên mới vào nhóm
    await Models.NhomChat.findByIdAndUpdate(roomId, {
      $addToSet: { ThanhVien: { $each: newMembers } }, // $addToSet để tránh trùng lặp
    });

    // Cập nhật thuộc tính NhomChat của các thành viên mới
    await Models.TaiKhoan.updateMany(
      { _id: { $in: newMembers } },
      { $addToSet: { NhomChat: roomChat._id } }
    );

    res.status(200).json({
      message: "Members added to group chat successfully",
      room_id: roomChat._id,
      existingMembers, // Danh sách thành viên đã có trong nhóm
      newMembers,     // Danh sách thành viên mới được thêm
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = {
  createOrFindRoomChat,
  getUserRooms,
  getAllMessage,
  createGroupChat,
  getUnseenMessageCount,
  markAllMessagesAsSeen,
  editGroupChatName,
  deleteBoxChat,
  deleteSingleMessage,
  addMemberToGroupChat
};

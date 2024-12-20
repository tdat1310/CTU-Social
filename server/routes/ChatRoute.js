const express = require("express");
const {
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
} = require("../controllers/ChatController")
const router = express.Router();
const upload = require("../utils/uploadHandle/multer");
const { createDinhKem } = require("../controllers/DinhKemController");
//create room chat
router.put("/createOrFind/room", createOrFindRoomChat);

//create group chat
router.post("/createGroupChat", createGroupChat);

//get all room chat
router.get("/get/room/:userId", getUserRooms);

//get all message with boxchat_id
router.get("/messages/:id", getAllMessage);

//get miss messgage 
router.get("/MissMsg/:userId", getUnseenMessageCount);

//set all seen messgae
router.put("/setSeenMsg", markAllMessagesAsSeen);

//edit group chat name 
router.put("/editGroupChatName", editGroupChatName);

//delete box chat
router.put("/deleteGroupChat", deleteBoxChat);

//delete single chat
router.put("/deleteSingleMsg", deleteSingleMessage)

//add member to group chat
router.put("/addMemberToGroupChat", addMemberToGroupChat)

//file message
router.post("/attachs/:room_id", upload.single("file"), createDinhKem);



module.exports = router;

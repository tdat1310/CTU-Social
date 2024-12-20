const express = require("express");
const {
  getSingleDataUser,
  reloadUserData,
  getUserNameById,
  removeFollower,
  updateUserInfo,
} = require("../controllers/TaiKhoanController");
const {
  createNhomNguoiDung,
} = require("../controllers/NhomNguoiDungController");
const { createNhomChat } = require("../controllers/NhomChatController");
const upload = require("../utils/uploadHandle/multer");
const { createDinhKem } = require("../controllers/DinhKemController");
const router = express.Router();

//Create user group
router.post("/groups/:id", createNhomNguoiDung);

//create boxchat
router.post("/boxchats/:id", createNhomChat);

//get single user
router.get("/:id", getSingleDataUser);

//reload data blog
router.get("/reload/:id", reloadUserData);

//get userName
router.get("/userName/:id", getUserNameById);

//unfollow user
router.put("/unfollow", removeFollower);

//update info user
router.put("/updateProfile/:userId", updateUserInfo);

router.post("/uploadPic/:acc_id", upload.single("file"), createDinhKem)

module.exports = router;

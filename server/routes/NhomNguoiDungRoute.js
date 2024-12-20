const express = require("express");
const {
  createNhomNguoiDung,
  addUserToGroup,
  getAllGroup,
  getGroupDetails,
  updateGroupInfo,
  getAllPostsFromGroups,
  leaveGroup,
  deleteGroup,
  updateUserRoleInGroup,
  getAttachmentsByGroupId,
  searchPostsInGroup,
} = require("../controllers/NhomNguoiDungController");
const router = express.Router();
const upload = require("../utils/uploadHandle/multer");
const { createDinhKem } = require("../controllers/DinhKemController");
//create group
router.post("/create", createNhomNguoiDung);

//create post with group_id
router.post("/posts/:id");

//get all post with group_id
router.get("/posts/:id");

//get all member with group_id
router.get("/accounts/:id");

// join group
router.put("/join/group", addUserToGroup);

//get all group
router.get("/get/group/:userId", getAllGroup);

// get detail group
router.get("/get/group/detail/:group_id", getGroupDetails);

//edit info group
router.put("/editInfo/group", updateGroupInfo);

//upload cover pic
router.post("/upload/coverPicGroup/:group_id", upload.single("file"), createDinhKem);

//get all post type group 
router.get('/get/postTypeGroup/:userId', getAllPostsFromGroups)

//leave user group
router.put('/leaveGroup', leaveGroup)

//detete group
router.put('/deleteGroup/:groupId', deleteGroup)

//add to accept role
router.put('/add/role/accept', updateUserRoleInGroup)

//search post in group
router.get('/search/post/:groupId', searchPostsInGroup)

module.exports = router;

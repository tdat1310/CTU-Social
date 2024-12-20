const express = require("express");
const {
  createBaiDang,
  deleteBaiDang,
  updateBaiDang,
  getSinglePost,
  removeUserFromLikedBy,
  removeUserFromSavedBy,
  createComment,
  deleteComment,
  editComment,
  searchTags,
  getAllPostByTagId,
  unfollowTag,
  followTag,
} = require("../controllers/BaiDangController");
const { createBinhLuan } = require("../controllers/BinhLuanController");
const { createDinhKem } = require("../controllers/DinhKemController");
const { createTag } = require("../controllers/TagController");
const router = express.Router();
const upload = require("../utils/uploadHandle/multer");

//Create post
router.post("/:user_id", createBaiDang);
//Create comment
router.post("/comments/:post_id", createBinhLuan);
//create attach
router.post("/attachs/:post_id", upload.single("file"), createDinhKem);
//create tag
router.post("/tags/:post_id", createTag);
//delete post
router.delete("/:post_id", deleteBaiDang);
//update post
router.put("/:post_id", updateBaiDang);
//get single post
router.get("/reload/:post_id", getSinglePost);
//remove like user
router.put("/like/remove/:post_id/:user_id", removeUserFromLikedBy);
//remove save user
router.put("/save/remove/:post_id/:user_id", removeUserFromSavedBy);
//create comment
router.post("/create/comment/:post_id/:user_id", createComment);
//delete comment
router.delete("/delete/comment/:cmt_id", deleteComment);
//edit comment
router.put("/edit/comment/:cmt_id", editComment);
//get tag
router.get("/tag", searchTags);
//get all post by tag
router.get("/postByTag/:tag_id", getAllPostByTagId);
//follow tag
router.put("/follow/tag", followTag);
//unfollow tag
router.put("/unFollow/tag", unfollowTag);

module.exports = router;

const express = require("express");
const { getAllAccount } = require("../controllers/TaiKhoanController");
const { getAllPost } = require("../controllers/BaiDangController");
const { getAllTag } = require("../controllers/TagController");
const { getAllGroup } = require("../controllers/NhomNguoiDungController");
const {
  getGlobalData,
  searchAllData,
  getSuggestions,
  findUsersByMutualFollowers,
} = require("../controllers/globalController");
const router = express.Router();

//Get all account
router.get("/accounts", getAllAccount);

//Get all post
router.get("/posts", getAllPost);

//Get all tag
router.get("/tags", getAllTag);

//get all group
router.get("/groups", getAllGroup);

//get global data
router.get("/globalData", getGlobalData);

// get result search
router.get("/search/result", searchAllData);

// get suggestion
router.get("/search/suggest", getSuggestions);

//get recommend user
router.get("/get/userRcm/:userId", findUsersByMutualFollowers)

module.exports = router;

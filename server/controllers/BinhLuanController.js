const asyncHandler = require("express-async-handler");
const { Models } = require("../models/AllModel");
const createBinhLuan = asyncHandler(async (req, res) => {
    try {
        const BinhLuan = await Models.BinhLuan.create(req.body)
        res.status(200).json(BinhLuan);
    } catch (error) {
      res.status(500);
      throw new Error(error.message);
    }
  });
  
  module.exports = {
    createBinhLuan
  };
  
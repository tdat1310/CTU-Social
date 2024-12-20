const asyncHandler = require("express-async-handler");
const { Models } = require("../models/AllModel");
const createTinNhan = asyncHandler(async (req, res) => {
  try {
    const TinNhan = await Models.TinNhan.create(req.body)
    res.status(200).json(TinNhan);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

module.exports = {
    createTinNhan,
};

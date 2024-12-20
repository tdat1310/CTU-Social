const express = require("express");
const { getAllMessage } = require("../controllers/NhomChatController");
const router = express.Router();
//create message with boxchat_id
router.post("/messages/:id", );

//get all message with boxchat_id
router.get("/messages/:id", getAllMessage);

//get all member with boxchat_id
router.get("/accounts/:id", );


module.exports = router;
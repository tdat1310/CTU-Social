const express = require("express");
const { registerUser, loginUser } = require("../controllers/AuthController");
const router = express.Router();

//register account
router.post("/register", registerUser)

//login account
router.post("/login", loginUser)

module.exports = router
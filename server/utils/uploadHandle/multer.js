const path = require("path");
const fs = require("fs");
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const username = req.body.userName;
      const type = req.body.type
      const uploadDir = path.join(__dirname, `uploads/${username}/${type}`);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, Math.random() + "_" + file.originalname);
    },
  });
  const upload = multer({ storage });
  module.exports = upload
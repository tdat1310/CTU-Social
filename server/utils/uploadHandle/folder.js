const fs = require("fs");
const path = require("path");
const clearFolder = (dirPath) => {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(dirPath, file);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error("Error getting file stats:", err);
          return;
        }

        if (stats.isDirectory()) {
          clearFolder(filePath); // Recursive call to clear subdirectory
          fs.rm(filePath, { recursive: true, force: true }, (err) => {
            if (err) {
              console.error("Error removing directory:", err);
            } else {
              console.log("Removed directory:", filePath);
            }
          });
        } else {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error("Error removing file:", err);
            } else {
              console.log("Removed file:", filePath);
            }
          });
        }
      });
    });
  });
};
module.exports = clearFolder

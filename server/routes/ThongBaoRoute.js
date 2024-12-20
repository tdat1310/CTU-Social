const express = require("express");
const {
  createThongBao,
  getThongBaoByTaiKhoanId,
  updateSeenStatus,
  deleteThongBaoById,
  removeNotificationById,  // Import the new function
} = require("../controllers/ThongBaoController");
const router = express.Router();

// Create a new notification
router.post('/', createThongBao);

// Get all notifications by user ID
router.get('/:user_id', getThongBaoByTaiKhoanId);

// Update 'seen' status of all notifications to true for a specific user
router.put('/seen/:user_id', updateSeenStatus);

// clear notify
router.delete('/clearAll/:user_id', deleteThongBaoById)

// clear single notify
router.delete('/clear/:notify_id', removeNotificationById)

module.exports = router;

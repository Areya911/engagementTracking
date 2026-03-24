const express = require("express");
const router = express.Router();

const {
  sendNotification,
  getMyNotifications,
  markRead
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

/* ADMIN */
router.post("/send", protect, isAdmin, sendNotification);

/* STUDENT */
router.get("/my", protect, getMyNotifications);
router.put("/read/:id", protect, markRead);

module.exports = router;
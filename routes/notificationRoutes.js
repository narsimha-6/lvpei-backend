const express = require("express");

const router = express.Router();

const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");


// Get all notifications for logged in user
router.get("/", protect, getNotifications);

// Get unread notification count
router.get("/unread-count", protect, getUnreadCount);

// Mark a notification as read
router.patch("/:id/read", protect, markAsRead);

// Mark all notifications as read
router.patch("/read-all", protect, markAllAsRead);

// Delete notification
router.delete("/:id", protect, deleteNotification);

module.exports = router;
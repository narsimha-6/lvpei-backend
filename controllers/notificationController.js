const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
  try {

    console.log("Logged in User:", req.user);

    const notifications = await Notification.find({
  receiver: req.user._id,
})
  .populate("sender", "name email role")
  .populate("referralId")
  .sort({ createdAt: -1 });

    console.log("Notifications:", notifications);

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

const getUnreadCount = async (req, res) => {
  try {

    const unread = await Notification.countDocuments({
      receiver: req.user._id,
      isRead: false,
    });

    return res.status(200).json({
      success: true,
      unread,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



const markAsRead = async (req, res) => {
  try {

    const notification =
      await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    if (
      notification.receiver.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await Notification.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



const markAllAsRead = async (req, res) => {
  try {

    await Notification.updateMany(
      {
        receiver: req.user._id,
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


const deleteNotification = async (req, res) => {
  try {

    const notification =
      await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    if (
      notification.receiver.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await notification.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Notification deleted",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
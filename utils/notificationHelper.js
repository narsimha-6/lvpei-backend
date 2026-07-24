const Notification = require("../models/Notification");

const createNotification = async ({
  receiver,
  sender,
  title,
  message,
  referralId = null,
  io = null,
}) => {
  const notification = await Notification.create({
    receiver,
    sender,
    title,
    message,
    referralId,
  });

  // Emit socket event if io is available
  if (io) {
    io.emit("newNotification", notification);
  }

  return notification;
};

module.exports = createNotification;
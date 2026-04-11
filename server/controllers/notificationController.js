const Notification = require("../models/Notification");

/* ADMIN SEND ALERT */
exports.sendNotification = async (req, res) => {
  try {

    const { userId, message } = req.body;

    const notification = await Notification.create({
      user: userId,
      message
    });

    res.json(notification);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* STUDENT GET MY NOTIFICATIONS */
exports.getMyNotifications = async (req, res) => {
  try {

    const notifications = await Notification.find({
      user: req.user._id
    }).sort({ createdAt: -1 });

    res.json(notifications);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* MARK READ */
exports.markRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
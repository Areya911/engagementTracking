const User = require('../models/User');

// GET all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// update admin profile (name, department, phone) - for logged-in users
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;   // comes from auth middleware

    const { name, department, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, department, phone },
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
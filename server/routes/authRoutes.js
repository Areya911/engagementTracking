const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { getMe } = require('../controllers/authController');

router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;

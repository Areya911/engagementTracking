const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

router.get('/user', protect, (req, res) => {
    res.json({ message: `Welcome ${req.user.name}, you are logged in!` });
});

router.get('/admin', protect, isAdmin, (req, res) => {
    res.json({ message: `Welcome Admin ${req.user.name}` });
});

module.exports = router;

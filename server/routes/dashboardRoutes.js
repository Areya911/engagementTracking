const express = require('express');
const router = express.Router();

const { getDashboardStats, getAlerts } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

router.get('/', protect, isAdmin, getDashboardStats);
router.get('/alerts', protect, isAdmin, getAlerts);

module.exports = router;
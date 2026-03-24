const express = require('express');
const router = express.Router();

const { getDashboardStats, getAlerts, getAnalytics } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

router.get('/',          protect, isAdmin, getDashboardStats);
router.get('/alerts',    protect, isAdmin, getAlerts);
router.get('/analytics', protect, isAdmin, getAnalytics);

module.exports = router;
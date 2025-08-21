const express = require('express');
const { protect, managerOnly } = require('../middlewares/authMiddleware');
const { getStats } = require('../controllers/dashboardController');
const router = express.Router();

router.get('/stats', protect, managerOnly, getStats);
module.exports = router;

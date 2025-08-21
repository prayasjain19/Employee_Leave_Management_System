const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { getCalendarEvents } = require('../controllers/calendarController');
const router = express.Router();

router.get('/', protect, getCalendarEvents);
module.exports = router;

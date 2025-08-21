const express = require('express');
const { getProfile, getAllEmployees } = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/me', protect, getProfile);
router.get('/employees', protect, authorizeRoles('manager'), getAllEmployees);

module.exports = router;

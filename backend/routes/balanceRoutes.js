const express = require('express');
const router = express.Router();

const {
  getMyBalance,
  getEmployeeBalance,
} = require('../controllers/balanceController');

const { protect, managerOnly } = require('../middlewares/authMiddleware');

// Employee checking their own balance
router.get('/me', protect, getMyBalance);

// Manager checking any employee’s balance
router.get('/:id', protect, managerOnly, getEmployeeBalance);

module.exports = router;

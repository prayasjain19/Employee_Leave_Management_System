const express = require('express');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const {
  createLeaveRequest,
  getMyLeaveRequests,
  getPendingRequests,
  approveOrRejectLeave
} = require('../controllers/leaveController');

const router = express.Router();

router.post('/', protect, authorizeRoles('employee'), createLeaveRequest);
router.get('/me', protect, authorizeRoles('employee'), getMyLeaveRequests);
router.get('/pending', protect, authorizeRoles('manager'), getPendingRequests);
router.patch('/:id/decision', protect, authorizeRoles('manager'), approveOrRejectLeave);

module.exports = router;

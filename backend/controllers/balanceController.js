// controllers/balance.controller.js

const LeaveBalance = require('../models/LeaveBalance');

// Employee's own leave balance
exports.getMyBalance = async (req, res) => {
  const balance = await LeaveBalance.findOne({ user: req.user._id });
  if (!balance) return res.status(404).json({ message: 'Leave balance not found' });
  res.json(balance);
};

// Manager fetching an employee's leave balance
exports.getEmployeeBalance = async (req, res) => {
  const { id } = req.params;
  const balance = await LeaveBalance.findOne({ user: id }).populate('user', 'name email');
  if (!balance) return res.status(404).json({ message: 'Leave balance not found' });
  res.json(balance);
};

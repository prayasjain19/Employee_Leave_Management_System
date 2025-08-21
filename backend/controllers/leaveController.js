const LeaveRequest = require('../models/LeaveRequest');
const { sendLeaveNotification } = require('../services/email.service'); 
const LeaveBalance = require('../models/LeaveBalance');
const User = require("../models/User");  

// Create a leave request (Employee)
exports.createLeaveRequest = async (req, res) => {
  const { leaveType, startDate, endDate, reason } = req.body;

  if (!leaveType || !startDate || !endDate || !reason) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start) || isNaN(end)) {
    return res.status(400).json({ message: 'Invalid date format' });
  }

  if (start > end) {
    return res.status(400).json({ message: 'Start date must be before end date' });
  }

  try {
    const balance = await LeaveBalance.findOne({ user: req.user._id });
    if (!balance) return res.status(404).json({ message: 'Leave balance not found' });

    const leaveDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    if (leaveType === 'vacation' && leaveDays > balance.vacationDays) {
      return res.status(400).json({ message: 'Insufficient vacation balance' });
    }
    if (leaveType === 'sick' && leaveDays > balance.sickDays) {
      return res.status(400).json({ message: 'Insufficient sick balance' });
    }

    const leave = await LeaveRequest.create({
      employee: req.user._id,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    res.status(201).json({ message: 'Leave request submitted', leave });
  } catch (err) {
    res.status(500).json({ message: 'Leave request failed', error: err.message });
  }
};

// Get all leave requests of logged-in employee
exports.getMyLeaveRequests = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ employee: req.user._id });
    res.status(200).json(leaves);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch leave requests', error: err.message });
  }
};

// Manager: Get all pending leave requests
exports.getPendingRequests = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ status: 'Pending' }).populate('employee', 'name email');
    res.status(200).json(leaves);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch pending requests', error: err.message });
  }
};



// Manager: Approve or reject a leave request
exports.approveOrRejectLeave = async (req, res) => {
  const { id } = req.params;
  const { decision, managerComments } = req.body;

  if (!['Approved', 'Rejected'].includes(decision)) {
    return res.status(400).json({ message: 'Decision must be Approved or Rejected' });
  }

  try {
    const leave = await LeaveRequest.findById(id);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });

    if (leave.status !== 'Pending') {
      return res.status(400).json({ message: 'Leave request already processed' });
    }

    leave.status = decision;
    leave.managerComments = managerComments || '';
    await leave.save();

    if (decision === 'Approved') {
      const balance = await LeaveBalance.findOne({ user: leave.employee });
      if (!balance) return res.status(404).json({ message: 'Leave balance not found' });

      const leaveDays =
        Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1;

      if (leave.leaveType === 'vacation') {
        if (balance.vacationDays < leaveDays)
          return res.status(400).json({ message: 'Not enough vacation days' });
        balance.vacationDays -= leaveDays;
      }

      if (leave.leaveType === 'sick') {
        if (balance.sickDays < leaveDays)
          return res.status(400).json({ message: 'Not enough sick days' });
        balance.sickDays -= leaveDays;
      }

      await balance.save();
    }

    // ✅ Send notification email after approval/rejection
    const employee = await User.findById(leave.employee);
    if (employee?.email) {
      const subject = `Your leave has been ${decision.toLowerCase()}`;
      const text = `Hi ${employee.name},\n\nYour leave request from ${new Date(leave.startDate).toDateString()} to ${new Date(leave.endDate).toDateString()} has been ${decision.toLowerCase()}.\n\nManager's Comments: ${managerComments || 'None'}\n\nRegards,\nLeave Management System`;

      await sendLeaveNotification(employee.email, subject, text);
    }

    res.status(200).json({ message: `Leave ${decision.toLowerCase()}`, leave });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update leave request', error: err.message });
  }
};

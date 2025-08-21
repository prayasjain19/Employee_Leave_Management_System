const User = require('../models/User');
const LeaveRequest = require('../models/LeaveRequest');

exports.getStats = async (req, res) => {
  try {
    const [totalEmployees, pending, approved, rejected] = await Promise.all([
      User.countDocuments({ role: 'employee' }),
      LeaveRequest.countDocuments({ status: 'Pending' }),
      LeaveRequest.countDocuments({ status: 'Approved' }),
      LeaveRequest.countDocuments({ status: 'Rejected' })
    ]);
    res.status(200).json({ totalEmployees, pending, approved, rejected });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
  }
};

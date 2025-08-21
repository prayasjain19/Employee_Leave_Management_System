const LeaveRequest = require('../models/LeaveRequest');

exports.getCalendarEvents = async (req, res) => {
  try {
    const isManager = req.user.role === 'manager';

    const filter = isManager
      ? { status: 'Approved' }                     // Managers see all approved leaves
      : { status: 'Approved', employee: req.user._id }; // Employees see only their own

    const events = await LeaveRequest.find(filter).populate('employee', 'name');

    const formatted = events.map(e => ({
      title: isManager
        ? `${e.employee.name} – ${e.leaveType}`     // Show names to manager
        : `You – ${e.leaveType}`,                  // Show only "You" to employee
      start: e.startDate,
      end: new Date(new Date(e.endDate).setDate(new Date(e.endDate).getDate() + 1)),
      status: e.status
    }));

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load calendar data', error: err.message });
  }
};

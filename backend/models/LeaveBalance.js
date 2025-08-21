const mongoose = require('mongoose');

const leaveBalanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vacationDays: {
        type: Number,
        default: 20
    },
    sickDays: {
        type: Number,
        default: 10
    }
}, { timestamps: true });

module.exports = mongoose.model('LeaveBalance', leaveBalanceSchema);

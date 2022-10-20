const mongoose = require('../config/database');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isEmailVerified: {
        type: Boolean,
    },
    isPhoneVerified: {
        type: Boolean,
    },
    isAdmin: {
        type: Boolean,
    },
    status: {
        type: String,
        enum: ['Active', 'Blocked', 'Deleted'],
        default: 'Active',
    },

});

module.exports = mongoose.model('info', userSchema);

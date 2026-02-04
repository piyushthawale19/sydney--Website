const mongoose = require('mongoose');
const validator = require('validator');

const interestSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Invalid email address']
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    consent: {
        type: Boolean,
        default: false
    },
    ipAddress: {
        type: String,
        trim: true
    },
    userAgent: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

interestSchema.index({ email: 1, eventId: 1 });
interestSchema.index({ eventId: 1 });
interestSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Interest', interestSchema);

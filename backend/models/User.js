const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    picture: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'admin' // For demo, all Google users are admins
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

module.exports = mongoose.model('User', userSchema);

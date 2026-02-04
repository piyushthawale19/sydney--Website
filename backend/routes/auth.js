const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
    googleCallback,
    getMe,
    logout,
    verifyToken
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Google OAuth routes
router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false
    })
);

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`,
        session: false
    }),
    googleCallback
);

// Token verification
router.post('/verify', verifyToken);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;

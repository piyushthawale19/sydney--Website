const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
exports.googleCallback = async (req, res) => {
    try {
        // User is authenticated via Passport
        const user = req.user;

        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
        }

        // Generate JWT token
        const token = generateToken(user._id);

        let frontendUrl = process.env.FRONTEND_URL;

        // Safety check: Prevent localhost redirect in production
        if (process.env.NODE_ENV === 'production' && frontendUrl.includes('localhost')) {
            console.log('⚠️ Overriding localhost FRONTEND_URL to production Vercel URL');
            frontendUrl = 'https://sydney-website-kappa.vercel.app';
        }

        // Redirect to frontend with token
        const redirectUrl = `${frontendUrl}/auth/callback?token=${token}`;
        console.log('Google Auth Success. Redirecting to:', redirectUrl);
        res.redirect(redirectUrl);
    } catch (error) {
        console.error('Google callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-__v');

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: 'Error logging out'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    });
};

// @desc    Verify token
// @route   POST /api/auth/verify
// @access  Public
exports.verifyToken = async (req, res, next) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                error: 'No token provided'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user
        const user = await User.findById(decoded.id).select('-__v');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            error: 'Invalid token'
        });
    }
};

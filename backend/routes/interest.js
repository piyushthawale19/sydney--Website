const express = require('express');
const router = express.Router();
const {
    recordInterest,
    getInterests,
    getInterestStats
} = require('../controllers/interestController');
const { protect, authorize } = require('../middleware/auth');

// Public route - record interest
router.post('/', recordInterest);

// Protected routes (Admin only)
router.get('/', protect, authorize('admin'), getInterests);
router.get('/stats', protect, authorize('admin'), getInterestStats);

module.exports = router;

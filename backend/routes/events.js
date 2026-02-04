const express = require('express');
const router = express.Router();
const {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    importEvent,
    deleteEvent,
    getEventStats
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getEvents);
router.get('/:id', getEvent);

// Protected routes (Admin only)
router.use(protect);
router.use(authorize('admin'));

router.post('/', createEvent);
router.put('/:id', updateEvent);
router.patch('/:id/import', importEvent);
router.delete('/:id', deleteEvent);
router.get('/stats/overview', getEventStats);

module.exports = router;

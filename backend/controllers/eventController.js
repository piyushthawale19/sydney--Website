const Event = require('../models/Event');

// @desc    Get all events with filtering, pagination, and search
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res, next) => {
    try {
        const {
            city,
            category,
            keyword,
            startDate,
            endDate,
            status,
            page = 1,
            limit = 20,
            sort = '-dateTime'
        } = req.query;

        // Build query
        const query = {};

        // City filter
        if (city) {
            query.city = city;
        }

        // Category filter
        if (category) {
            query.category = new RegExp(category, 'i');
        }

        // Keyword search (title, description, venue)
        if (keyword) {
            query.$text = { $search: keyword };
        }

        // Date range filter
        if (startDate || endDate) {
            query.dateTime = {};
            if (startDate) {
                query.dateTime.$gte = new Date(startDate);
            }
            if (endDate) {
                query.dateTime.$lte = new Date(endDate);
            }
        }

        // Status filter
        if (status) {
            query.status = { $in: status.split(',') };
        }

        // For public API, only show active events (not inactive)
        if (!req.user) {
            query.status = { $nin: ['inactive'] };
            query.dateTime = { $gte: new Date() }; // Future events only
        }

        // Pagination
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;

        // Execute query
        const events = await Event.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limitNum)
            .lean();

        // Get total count
        const total = await Event.countDocuments(query);

        res.status(200).json({
            success: true,
            count: events.length,
            total,
            totalPages: Math.ceil(total / limitNum),
            currentPage: pageNum,
            data: events
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                error: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Admin)
exports.createEvent = async (req, res, next) => {
    try {
        const event = await Event.create(req.body);

        res.status(201).json({
            success: true,
            data: event
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Admin)
exports.updateEvent = async (req, res, next) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!event) {
            return res.status(404).json({
                success: false,
                error: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Import event to platform
// @route   PATCH /api/events/:id/import
// @access  Private (Admin)
exports.importEvent = async (req, res, next) => {
    try {
        const { importNotes } = req.body;

        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                error: 'Event not found'
            });
        }

        // Update event with import details
        event.imported = true;
        event.importedAt = new Date();
        event.importedBy = req.user.email;
        event.importNotes = importNotes || '';

        // Add 'imported' to status if not already present
        if (!event.status.includes('imported')) {
            event.status.push('imported');
        }

        await event.save();

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Admin)
exports.deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                error: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get event statistics
// @route   GET /api/events/stats/overview
// @access  Private (Admin)
exports.getEventStats = async (req, res, next) => {
    try {
        const total = await Event.countDocuments();
        const newCount = await Event.countDocuments({ status: 'new' });
        const updatedCount = await Event.countDocuments({ status: 'updated' });
        const importedCount = await Event.countDocuments({ imported: true });
        const inactiveCount = await Event.countDocuments({ status: 'inactive' });

        // Events by category
        const byCategory = await Event.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Events by source
        const bySource = await Event.aggregate([
            {
                $group: {
                    _id: '$sourceSite',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Upcoming events
        const upcoming = await Event.countDocuments({
            dateTime: { $gte: new Date() },
            status: { $nin: ['inactive'] }
        });

        res.status(200).json({
            success: true,
            data: {
                total,
                newCount,
                updatedCount,
                importedCount,
                inactiveCount,
                upcoming,
                byCategory,
                bySource
            }
        });
    } catch (error) {
        next(error);
    }
};

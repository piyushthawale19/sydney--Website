const Interest = require('../models/Interest');
const Event = require('../models/Event');

// @desc    Record user interest in an event
// @route   POST /api/interest
// @access  Public
exports.recordInterest = async (req, res, next) => {
    try {
        const { email, eventId, consent } = req.body;

        // Validate required fields
        if (!email || !eventId) {
            return res.status(400).json({
                success: false,
                error: 'Email and eventId are required'
            });
        }

        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                error: 'Event not found'
            });
        }

        // Check if interest already exists
        const existingInterest = await Interest.findOne({ email, eventId });
        if (existingInterest) {
            return res.status(200).json({
                success: true,
                message: 'Interest already recorded',
                data: existingInterest
            });
        }

        // Create interest record
        const interest = await Interest.create({
            email,
            eventId,
            consent: consent || false,
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent')
        });

        res.status(201).json({
            success: true,
            message: 'Interest recorded successfully',
            data: interest
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all interests (admin)
// @route   GET /api/interest
// @access  Private (Admin)
exports.getInterests = async (req, res, next) => {
    try {
        const { eventId, page = 1, limit = 20 } = req.query;

        // Build query
        const query = {};
        if (eventId) {
            query.eventId = eventId;
        }

        // Pagination
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;

        // Execute query with event details
        const interests = await Interest.find(query)
            .populate('eventId', 'title dateTime venue')
            .sort('-createdAt')
            .skip(skip)
            .limit(limitNum);

        const total = await Interest.countDocuments(query);

        res.status(200).json({
            success: true,
            count: interests.length,
            total,
            totalPages: Math.ceil(total / limitNum),
            currentPage: pageNum,
            data: interests
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get interest statistics
// @route   GET /api/interest/stats
// @access  Private (Admin)
exports.getInterestStats = async (req, res, next) => {
    try {
        const total = await Interest.countDocuments();
        const withConsent = await Interest.countDocuments({ consent: true });

        // Top events by interest
        const topEvents = await Interest.aggregate([
            {
                $group: {
                    _id: '$eventId',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'events',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'event'
                }
            },
            { $unwind: '$event' },
            {
                $project: {
                    count: 1,
                    title: '$event.title',
                    dateTime: '$event.dateTime'
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                total,
                withConsent,
                topEvents
            }
        });
    } catch (error) {
        next(error);
    }
};

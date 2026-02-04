require('dotenv').config();
const mongoose = require('mongoose');
const EventbriteScraper = require('./eventbrite');
const SydneyComScraper = require('./sydneycom');
const WhatsOnScraper = require('./whatson');
const Event = require('../models/Event');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
};

// Mark inactive events
const markInactiveEvents = async () => {
    try {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        const result = await Event.updateMany(
            {
                dateTime: { $lt: weekAgo },
                status: { $nin: ['inactive'] }
            },
            {
                $addToSet: { status: 'inactive' }
            }
        );

        console.log(`🗑️  Marked ${result.modifiedCount} events as inactive`);
    } catch (error) {
        console.error('Error marking inactive events:', error.message);
    }
};

// Run all scrapers
const runAllScrapers = async () => {
    console.log('\n🚀 Starting scraping pipeline...\n');
    console.log('='.repeat(50));

    const startTime = Date.now();
    const results = {
        total: { new: 0, updated: 0, skipped: 0 },
        bySource: {}
    };

    try {
        // 1. Eventbrite
        const eventbriteScraper = new EventbriteScraper();
        const eventbriteEvents = await eventbriteScraper.scrape();
        const eventbriteResults = await eventbriteScraper.saveEvents(eventbriteEvents);
        results.bySource.eventbrite = eventbriteResults;
        results.total.new += eventbriteResults.newCount;
        results.total.updated += eventbriteResults.updatedCount;
        results.total.skipped += eventbriteResults.skippedCount;

        console.log('='.repeat(50));

        // 2. Sydney.com
        const sydneycomScraper = new SydneyComScraper();
        const sydneycomEvents = await sydneycomScraper.scrape();
        const sydneycomResults = await sydneycomScraper.saveEvents(sydneycomEvents);
        results.bySource.sydneycom = sydneycomResults;
        results.total.new += sydneycomResults.newCount;
        results.total.updated += sydneycomResults.updatedCount;
        results.total.skipped += sydneycomResults.skippedCount;

        console.log('='.repeat(50));

        // 3. What's On Sydney (Puppeteer - optional, can be slow)
        const whatsonScraper = new WhatsOnScraper();
        const whatsonEvents = await whatsonScraper.scrape();
        const whatsonResults = await whatsonScraper.saveEvents(whatsonEvents);
        results.bySource.whatson = whatsonResults;
        results.total.new += whatsonResults.newCount;
        results.total.updated += whatsonResults.updatedCount;
        results.total.skipped += whatsonResults.skippedCount;

        console.log('='.repeat(50));

        // 4. Mark old events as inactive
        await markInactiveEvents();

        console.log('='.repeat(50));

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        console.log('\n📈 SCRAPING SUMMARY');
        console.log('='.repeat(50));
        console.log(`✅ New Events: ${results.total.new}`);
        console.log(`🔄 Updated Events: ${results.total.updated}`);
        console.log(`➡️  Unchanged: ${results.total.skipped}`);
        console.log(`⏱️  Duration: ${duration}s`);
        console.log(`🕐 Completed at: ${new Date().toLocaleString()}`);
        console.log('='.repeat(50));

    } catch (error) {
        console.error('❌ Scraping pipeline error:', error.message);
    }
};

// Main execution
const main = async () => {
    await connectDB();
    await runAllScrapers();

    // Close connection
    await mongoose.connection.close();
    console.log('\n👋 MongoDB connection closed\n');
    process.exit(0);
};

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { runAllScrapers, connectDB };

require('dotenv').config();
const cron = require('node-cron');
const { runAllScrapers, connectDB } = require('./scrapers/runAll');

console.log('🤖 Sydney Events Scraper Service');
console.log('='.repeat(50));

// Connect to MongoDB
connectDB();

// Get cron schedule from environment or default to every 12 hours
const cronSchedule = process.env.SCRAPER_CRON_SCHEDULE || '0 */12 * * *';

console.log(`📅 Cron Schedule: ${cronSchedule}`);
console.log(`🕐 Next run will be according to schedule`);
console.log('='.repeat(50));

// Schedule scraping job
const task = cron.schedule(cronSchedule, async () => {
    console.log('\n⏰ Cron job triggered!');
    await runAllScrapers();
}, {
    scheduled: true,
    timezone: "Australia/Sydney"
});

console.log('✅ Scraper service is running...');
console.log('⌨️  Press Ctrl+C to stop\n');

// Optional: Run immediately on startup (comment out if not needed)
if (process.env.RUN_ON_STARTUP === 'true') {
    console.log('🚀 Running initial scrape on startup...\n');
    runAllScrapers();
}

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n👋 Stopping scraper service...');
    task.stop();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n\n👋 Stopping scraper service...');
    task.stop();
    process.exit(0);
});

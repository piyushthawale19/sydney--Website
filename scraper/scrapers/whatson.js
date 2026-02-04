const puppeteer = require('puppeteer');
const Event = require('../models/Event');

class WhatsOnScraper {
    constructor() {
        this.baseUrl = 'https://whatson.cityofsydney.nsw.gov.au/events';
    }

    async scrape() {
        console.log('🔄 Starting What\'s On Sydney scraper (Puppeteer)...');
        const events = [];
        let browser;

        try {
            browser = await puppeteer.launch({
                headless: process.env.PUPPETEER_HEADLESS !== 'false',
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
            });

            const page = await browser.newPage();

            // Set user agent
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

            // Navigate to page
            await page.goto(this.baseUrl, {
                waitUntil: 'networkidle2',
                timeout: parseInt(process.env.PUPPETEER_TIMEOUT) || 30000
            });

            // Wait for events to load
            await page.waitForSelector('.event-card, .event-item, article', { timeout: 10000 }).catch(() => {
                console.log('No event cards found, trying alternate selectors');
            });

            // Extract event data
            const scrapedEvents = await page.evaluate(() => {
                const eventCards = document.querySelectorAll('.event-card, .event-item, article[class*="event"]');
                const results = [];

                eventCards.forEach(card => {
                    try {
                        const titleEl = card.querySelector('h2, h3, .title, [class*="title"]');
                        const dateEl = card.querySelector('time, .date, [class*="date"]');
                        const venueEl = card.querySelector('.venue, [class*="venue"], [class*="location"]');
                        const linkEl = card.querySelector('a');
                        const imageEl = card.querySelector('img');
                        const descEl = card.querySelector('p, .description, [class*="description"]');

                        const title = titleEl ? titleEl.textContent.trim() : '';
                        const dateText = dateEl ? dateEl.textContent.trim() : '';
                        const dateAttr = dateEl ? dateEl.getAttribute('datetime') : '';
                        const venue = venueEl ? venueEl.textContent.trim() : 'City of Sydney';
                        const link = linkEl ? linkEl.href : '';
                        const imageUrl = imageEl ? imageEl.src : '';
                        const description = descEl ? descEl.textContent.trim() : '';

                        if (title && link) {
                            results.push({
                                title,
                                dateText: dateAttr || dateText,
                                venue,
                                link,
                                imageUrl,
                                description
                            });
                        }
                    } catch (err) {
                        console.error('Error parsing card:', err);
                    }
                });

                return results;
            });

            // Process scraped events
            for (const event of scrapedEvents) {
                let parsedDate = new Date();

                if (event.dateText) {
                    try {
                        parsedDate = new Date(event.dateText);
                        if (isNaN(parsedDate.getTime())) {
                            parsedDate = new Date();
                        }
                    } catch {
                        parsedDate = new Date();
                    }
                }

                events.push({
                    title: event.title,
                    dateTime: parsedDate,
                    venue: event.venue,
                    address: '',
                    city: 'Sydney',
                    description: event.description || `Event by City of Sydney: ${event.title}`,
                    shortDescription: (event.description || event.title).substring(0, 150),
                    category: 'City Events',
                    tags: ['city-of-sydney', 'whatson'],
                    imageUrl: event.imageUrl,
                    sourceSite: 'What\'s On Sydney',
                    originalUrl: event.link,
                    lastScraped: new Date()
                });
            }

            console.log(`✅ What's On Sydney: Found ${events.length} events`);
        } catch (error) {
            console.error('❌ What\'s On Sydney scraper error:', error.message);
        } finally {
            if (browser) {
                await browser.close();
            }
        }

        return events;
    }

    async saveEvents(events) {
        let newCount = 0;
        let updatedCount = 0;
        let skippedCount = 0;

        for (const eventData of events) {
            try {
                const existing = await Event.findSimilar(eventData.title, eventData.dateTime);

                if (!existing) {
                    await Event.create({
                        ...eventData,
                        status: ['new']
                    });
                    newCount++;
                } else {
                    const descChanged = existing.description !== eventData.description;
                    const venueChanged = existing.venue !== eventData.venue;

                    if (descChanged || venueChanged) {
                        existing.description = eventData.description;
                        existing.venue = eventData.venue;
                        existing.imageUrl = eventData.imageUrl;
                        existing.lastScraped = new Date();

                        if (!existing.status.includes('updated')) {
                            existing.status.push('updated');
                        }

                        await existing.save();
                        updatedCount++;
                    } else {
                        existing.lastScraped = new Date();
                        await existing.save();
                        skippedCount++;
                    }
                }
            } catch (error) {
                console.error(`Error saving event "${eventData.title}":`, error.message);
            }
        }

        console.log(`📊 What's On Sydney Results: ${newCount} new, ${updatedCount} updated, ${skippedCount} unchanged`);
        return { newCount, updatedCount, skippedCount };
    }
}

module.exports = WhatsOnScraper;

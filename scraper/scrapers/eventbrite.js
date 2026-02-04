const axios = require('axios');
const cheerio = require('cheerio');
const Event = require('../models/Event');

class EventbriteScraper {
    constructor() {
        this.baseUrl = 'https://www.eventbrite.com.au/d/australia--sydney/events/';
        this.userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ];
    }

    getRandomUserAgent() {
        return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
    }

    async scrape() {
        console.log('🔄 Starting Eventbrite scraper...');
        const events = [];

        try {
            const response = await axios.get(this.baseUrl, {
                headers: {
                    'User-Agent': this.getRandomUserAgent(),
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive'
                },
                timeout: 30000
            });

            const $ = cheerio.load(response.data);

            // Eventbrite uses dynamic class names, looking for common patterns
            // This is a simplified scraper - in production, use Puppeteer for JS-rendered content
            $('.search-event-card, [data-testid="search-event-card"], .discover-search-desktop-card').each((index, element) => {
                try {
                    const $card = $(element);

                    // Extract title
                    const title = $card.find('h3, h2, [data-testid="event-title"], .event-card__title').first().text().trim();

                    // Extract date/time
                    const dateText = $card.find('.event-card__date, [data-testid="event-date"], time').first().text().trim();

                    // Extract venue
                    const venue = $card.find('.event-card__venue, [data-testid="event-location"]').first().text().trim() || 'Venue TBA';

                    // Extract link
                    const link = $card.find('a').first().attr('href');
                    const fullLink = link && link.startsWith('http') ? link : `https://www.eventbrite.com.au${link}`;

                    // Extract image
                    const imageUrl = $card.find('img').first().attr('src') || '';

                    // Extract description (if available)
                    const description = $card.find('.event-card__description, p').first().text().trim() || 'Event details available on Eventbrite';

                    // Parse date (basic parsing - improve in production)
                    let parsedDate = new Date();
                    if (dateText) {
                        const dateMatch = dateText.match(/(\w{3})\s+(\d{1,2}),?\s+(\d{4})?/i);
                        if (dateMatch) {
                            parsedDate = new Date(dateText);
                        }
                    }

                    if (title && link) {
                        events.push({
                            title,
                            dateTime: parsedDate,
                            venue,
                            address: '',
                            city: 'Sydney',
                            description: description || `Event: ${title}`,
                            shortDescription: description.substring(0, 150),
                            category: 'General',
                            tags: ['eventbrite'],
                            imageUrl,
                            sourceSite: 'Eventbrite',
                            originalUrl: fullLink,
                            lastScraped: new Date()
                        });
                    }
                } catch (err) {
                    console.error('Error parsing event card:', err.message);
                }
            });

            console.log(`✅ Eventbrite: Found ${events.length} events`);
            return events;
        } catch (error) {
            console.error('❌ Eventbrite scraper error:', error.message);
            return [];
        }
    }

    async saveEvents(events) {
        let newCount = 0;
        let updatedCount = 0;
        let skippedCount = 0;

        for (const eventData of events) {
            try {
                // Find similar event
                const existing = await Event.findSimilar(eventData.title, eventData.dateTime);

                if (!existing) {
                    // New event
                    await Event.create({
                        ...eventData,
                        status: ['new']
                    });
                    newCount++;
                } else {
                    // Check if event details changed significantly
                    const descChanged = existing.description !== eventData.description;
                    const venueChanged = existing.venue !== eventData.venue;

                    if (descChanged || venueChanged) {
                        existing.description = eventData.description;
                        existing.venue = eventData.venue;
                        existing.address = eventData.address;
                        existing.imageUrl = eventData.imageUrl;
                        existing.lastScraped = new Date();

                        if (!existing.status.includes('updated')) {
                            existing.status.push('updated');
                        }

                        await existing.save();
                        updatedCount++;
                    } else {
                        // Just update lastScraped
                        existing.lastScraped = new Date();
                        await existing.save();
                        skippedCount++;
                    }
                }
            } catch (error) {
                console.error(`Error saving event "${eventData.title}":`, error.message);
            }
        }

        console.log(`📊 Eventbrite Results: ${newCount} new, ${updatedCount} updated, ${skippedCount} unchanged`);
        return { newCount, updatedCount, skippedCount };
    }
}

module.exports = EventbriteScraper;

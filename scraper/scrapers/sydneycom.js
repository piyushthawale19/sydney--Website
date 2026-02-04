const axios = require('axios');
const cheerio = require('cheerio');
const Event = require('../models/Event');

class SydneyComScraper {
    constructor() {
        this.baseUrl = 'https://www.sydney.com/events/search';
        this.userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ];
    }

    getRandomUserAgent() {
        return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
    }

    async scrape() {
        console.log('🔄 Starting Sydney.com scraper...');
        const events = [];

        try {
            const response = await axios.get(this.baseUrl, {
                headers: {
                    'User-Agent': this.getRandomUserAgent(),
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                },
                timeout: 30000
            });

            const $ = cheerio.load(response.data);

            // Sydney.com event card selectors (adjust based on actual HTML structure)
            $('.event-item, .event-card, article[class*="event"]').each((index, element) => {
                try {
                    const $card = $(element);

                    const title = $card.find('h2, h3, .event-title, [class*="title"]').first().text().trim();
                    const dateText = $card.find('.event-date, time, [class*="date"]').first().text().trim();
                    const venue = $card.find('.event-venue, .venue, [class*="venue"]').first().text().trim() || 'Sydney, Australia';
                    const link = $card.find('a').first().attr('href');
                    const fullLink = link && link.startsWith('http') ? link : `https://www.sydney.com${link}`;
                    const imageUrl = $card.find('img').first().attr('src') || '';
                    const description = $card.find('.event-description, p, [class*="description"]').first().text().trim() || `Discover this event in Sydney`;

                    // Parse date
                    let parsedDate = new Date();
                    if (dateText) {
                        try {
                            parsedDate = new Date(dateText);
                            if (isNaN(parsedDate.getTime())) {
                                parsedDate = new Date();
                            }
                        } catch {
                            parsedDate = new Date();
                        }
                    }

                    if (title && link) {
                        events.push({
                            title,
                            dateTime: parsedDate,
                            venue,
                            address: '',
                            city: 'Sydney',
                            description: description || `Event: ${title} in Sydney`,
                            shortDescription: description.substring(0, 150),
                            category: 'Tourism & Events',
                            tags: ['sydney.com', 'official'],
                            imageUrl,
                            sourceSite: 'Sydney.com',
                            originalUrl: fullLink,
                            lastScraped: new Date()
                        });
                    }
                } catch (err) {
                    console.error('Error parsing Sydney.com event card:', err.message);
                }
            });

            console.log(`✅ Sydney.com: Found ${events.length} events`);
            return events;
        } catch (error) {
            console.error('❌ Sydney.com scraper error:', error.message);
            return [];
        }
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

        console.log(`📊 Sydney.com Results: ${newCount} new, ${updatedCount} updated, ${skippedCount} unchanged`);
        return { newCount, updatedCount, skippedCount };
    }
}

module.exports = SydneyComScraper;

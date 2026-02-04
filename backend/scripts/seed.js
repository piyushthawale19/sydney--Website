require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('../models/Event');

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

// Sample events data
const sampleEvents = [
    {
        title: 'Sydney New Year\'s Eve Fireworks 2026',
        dateTime: new Date('2026-12-31T21:00:00'),
        endDateTime: new Date('2027-01-01T01:00:00'),
        venue: 'Sydney Harbour',
        address: 'Sydney Harbour, Sydney NSW 2000',
        city: 'Sydney',
        description: 'Ring in the New Year with spectacular fireworks over Sydney Harbour. One of the world\'s most iconic New Year\'s celebrations featuring two shows and stunning harbour views.',
        shortDescription: 'Iconic Sydney Harbour fireworks celebration to welcome the New Year with two spectacular shows.',
        category: 'Festival',
        tags: ['fireworks', 'new-year', 'harbour', 'family'],
        imageUrl: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800',
        sourceSite: 'Sydney.com',
        originalUrl: 'https://www.sydney.com/events/new-years-eve',
        status: ['new'],
        isFree: true,
        organizerName: 'City of Sydney'
    },
    {
        title: 'Vivid Sydney 2026 - Festival of Light, Music & Ideas',
        dateTime: new Date('2026-05-22T18:00:00'),
        endDateTime: new Date('2026-06-13T23:00:00'),
        venue: 'Various Locations',
        address: 'Sydney CBD and Harbour Foreshore',
        city: 'Sydney',
        description: 'Vivid Sydney transforms Sydney into a canvas of light, music and ideas. Experience large-scale light installations, creative building projections, and immersive music performances across the city.',
        shortDescription: 'Sydney\'s annual festival featuring spectacular light installations and projections across the city.',
        category: 'Arts & Culture',
        tags: ['lights', 'music', 'art', 'festival', 'vivid'],
        imageUrl: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=800',
        sourceSite: 'What\'s On Sydney',
        originalUrl: 'https://whatson.cityofsydney.nsw.gov.au/events/vivid-sydney',
        status: ['new'],
        isFree: true,
        organizerName: 'Destination NSW'
    },
    {
        title: 'Sydney Opera House: La Bohème',
        dateTime: new Date('2026-03-15T19:30:00'),
        venue: 'Sydney Opera House',
        address: 'Bennelong Point, Sydney NSW 2000',
        city: 'Sydney',
        description: 'Experience Puccini\'s timeless masterpiece at the iconic Sydney Opera House. This passionate tale of young love in 1830s Paris comes to life with world-class performers and stunning staging.',
        shortDescription: 'Puccini\'s classic opera performed at the world-famous Sydney Opera House.',
        category: 'Music',
        tags: ['opera', 'classical', 'performance', 'culture'],
        imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800',
        sourceSite: 'Eventbrite',
        originalUrl: 'https://www.eventbrite.com.au/e/la-boheme-tickets',
        status: ['new'],
        price: '$99 - $299',
        isFree: false,
        organizerName: 'Opera Australia'
    },
    {
        title: 'Sydney Royal Easter Show 2026',
        dateTime: new Date('2026-04-10T09:00:00'),
        endDateTime: new Date('2026-04-21T22:00:00'),
        venue: 'Sydney Showground',
        address: 'Sydney Olympic Park, Sydney NSW 2127',
        city: 'Sydney',
        description: 'Australia\'s largest annual event returns! Enjoy carnival rides, animal shows, live music, food competitions, and agricultural displays. A celebration of Australian culture and agriculture.',
        shortDescription: 'Australia\'s biggest annual event with rides, shows, food, and entertainment for all ages.',
        category: 'Festival',
        tags: ['easter-show', 'family', 'carnival', 'agriculture', 'food'],
        imageUrl: 'https://m.ahstatic.com/is/image/accorhotels/friends-carnival-ride:16by9?fmt=webp&op_usm=1.75,0.3,2,0&resMode=sharp2&iccEmbed=true&icc=sRGB&dpr=on,1.3&wid=1459&hei=820&qlt=80',
        sourceSite: 'Sydney.com',
        originalUrl: 'https://www.sydney.com/events/sydney-royal-easter-show',
        status: ['new'],
        price: '$25 - $45',
        isFree: false,
        organizerName: 'Royal Agricultural Society'
    },
    {
        title: 'Sculpture by the Sea - Bondi',
        dateTime: new Date('2026-10-15T07:00:00'),
        endDateTime: new Date('2026-11-01T20:00:00'),
        venue: 'Bondi to Tamarama Coastal Walk',
        address: 'Bondi Beach to Tamarama Beach',
        city: 'Sydney',
        description: 'World\'s largest free-to-public sculpture exhibition featuring over 100 sculptures by artists from around the globe along the stunning Bondi to Tamarama coastal walk.',
        shortDescription: 'Free outdoor sculpture exhibition along Sydney\'s beautiful coastal walk from Bondi to Tamarama.',
        category: 'Arts & Culture',
        tags: ['sculpture', 'art', 'outdoor', 'bondi', 'coastal'],
        imageUrl: 'https://www.bondi38.com.au/wp-content/uploads/2023/08/Sculpture-by-the-Sea-Bondi.jpg',
        sourceSite: 'What\'s On Sydney',
        originalUrl: 'https://sculpturebythesea.com/bondi/',
        status: ['new'],
        isFree: true,
        organizerName: 'Sculpture by the Sea'
    },
    {
        title: 'Sydney Comedy Festival',
        dateTime: new Date('2026-04-20T19:00:00'),
        endDateTime: new Date('2026-05-17T23:00:00'),
        venue: 'Various Venues',
        address: 'Sydney CBD',
        city: 'Sydney',
        description: 'Australia\'s largest comedy festival showcasing the best local and international comedians across multiple venues. Featuring stand-up, sketch, improv, and cabaret performances.',
        shortDescription: 'Sydney\'s premier comedy festival with top Australian and international comedians.',
        category: 'Entertainment',
        tags: ['comedy', 'stand-up', 'entertainment', 'festival'],
        imageUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800',
        sourceSite: 'Eventbrite',
        originalUrl: 'https://www.eventbrite.com.au/e/sydney-comedy-festival-tickets',
        status: ['new'],
        price: '$30 - $80',
        isFree: false,
        organizerName: 'Sydney Comedy Festival'
    },
    {
        title: 'Sydney Marathon 2026',
        dateTime: new Date('2026-09-20T07:00:00'),
        venue: 'Sydney CBD to Opera House',
        address: 'Starting at Milsons Point',
        city: 'Sydney',
        description: 'Join thousands of runners for Sydney\'s premier marathon event. Run across the iconic Sydney Harbour Bridge and finish at the Opera House with stunning harbour views.',
        shortDescription: 'Iconic marathon crossing Sydney Harbour Bridge with finish at the Opera House.',
        category: 'Sports',
        tags: ['marathon', 'running', 'fitness', 'harbour-bridge'],
        imageUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800',
        sourceSite: 'Eventbrite',
        originalUrl: 'https://www.eventbrite.com.au/e/sydney-marathon-tickets',
        status: ['new'],
        price: '$120 - $180',
        isFree: false,
        organizerName: 'Sydney Marathon Organisation'
    },
    {
        title: 'Night Noodle Markets',
        dateTime: new Date('2026-03-05T17:00:00'),
        endDateTime: new Date('2026-03-22T22:00:00'),
        venue: 'Hyde Park',
        address: 'Elizabeth Street, Sydney NSW 2000',
        city: 'Sydney',
        description: 'Sydney\'s favorite food market returns! Sample authentic Asian street food from over 40 stalls, enjoy live entertainment, and experience vibrant night market atmosphere.',
        shortDescription: 'Popular night food market featuring Asian street food, live music, and entertainment.',
        category: 'Food & Drink',
        tags: ['food', 'market', 'asian', 'night-market', 'street-food'],
        imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
        sourceSite: 'Sydney.com',
        originalUrl: 'https://www.sydney.com/events/night-noodle-markets',
        status: ['new'],
        isFree: true,
        organizerName: 'Good Food Month'
    },
    {
        title: 'Sydney Film Festival',
        dateTime: new Date('2026-06-03T18:00:00'),
        endDateTime: new Date('2026-06-14T23:00:00'),
        venue: 'State Theatre & Various Locations',
        address: '49 Market St, Sydney NSW 2000',
        city: 'Sydney',
        description: 'Australia\'s premier film festival showcasing the latest and best in world cinema. Features premieres, retrospectives, documentaries, and Q&As with filmmakers.',
        shortDescription: 'Premier film festival featuring international cinema, premieres, and filmmaker Q&As.',
        category: 'Arts & Culture',
        tags: ['film', 'cinema', 'festival', 'movie', 'documentary'],
        imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
        sourceSite: 'Eventbrite',
        originalUrl: 'https://www.eventbrite.com.au/e/sydney-film-festival-tickets',
        status: ['new'],
        price: '$15 - $35',
        isFree: false,
        organizerName: 'Sydney Film Festival'
    },
    {
        title: 'Bondi Beach Party',
        dateTime: new Date('2026-02-28T16:00:00'),
        venue: 'Bondi Beach',
        address: 'Bondi Beach, Sydney NSW 2026',
        city: 'Sydney',
        description: 'Celebrate summer at Bondi Beach with live DJs, beach games, food trucks, and sunset vibes. Free entry to Sydney\'s most iconic beach party.',
        shortDescription: 'Free beach party at iconic Bondi Beach with DJs, games, and sunset entertainment.',
        category: 'Music',
        tags: ['beach', 'party', 'summer', 'bondi', 'dj'],
        imageUrl: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800',
        sourceSite: 'What\'s On Sydney',
        originalUrl: 'https://whatson.cityofsydney.nsw.gov.au/events/bondi-beach-party',
        status: ['new'],
        isFree: true,
        organizerName: 'Bondi Events'
    },
    {
        title: 'Sydney Writers\' Festival',
        dateTime: new Date('2026-05-11T10:00:00'),
        endDateTime: new Date('2026-05-17T18:00:00'),
        venue: 'Carriageworks & Various Venues',
        address: '245 Wilson St, Eveleigh NSW 2015',
        city: 'Sydney',
        description: 'Celebrate the power of words and ideas with Australia\'s leading writers and thinkers. Featuring talks, panels, workshops, and book signings.',
        shortDescription: 'Festival celebrating literature with author talks, panels, and book signings.',
        category: 'Arts & Culture',
        tags: ['books', 'literature', 'writing', 'authors', 'festival'],
        imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
        sourceSite: 'Eventbrite',
        originalUrl: 'https://www.eventbrite.com.au/e/sydney-writers-festival-tickets',
        status: ['new'],
        price: '$10 - $40',
        isFree: false,
        organizerName: 'Sydney Writers\' Festival'
    },
    {
        title: 'Mardi Gras Parade 2026',
        dateTime: new Date('2026-03-07T19:00:00'),
        venue: 'Oxford Street',
        address: 'Oxford St, Darlinghurst NSW 2010',
        city: 'Sydney',
        description: 'Sydney\'s legendary LGBTQIA+ celebration featuring spectacular floats, costumes, music, and dancing. The parade is followed by the official after-party.',
        shortDescription: 'Iconic LGBTQIA+ celebration with spectacular parade, floats, and entertainment.',
        category: 'Festival',
        tags: ['mardi-gras', 'lgbtq', 'parade', 'pride', 'celebration'],
        imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
        sourceSite: 'Sydney.com',
        originalUrl: 'https://www.sydney.com/events/mardi-gras',
        status: ['new'],
        isFree: true,
        organizerName: 'Sydney Gay and Lesbian Mardi Gras'
    },
    {
        title: 'Australian Fashion Week',
        dateTime: new Date('2026-05-05T10:00:00'),
        endDateTime: new Date('2026-05-09T22:00:00'),
        venue: 'Carriageworks',
        address: '245 Wilson St, Eveleigh NSW 2015',
        city: 'Sydney',
        description: 'Australia\'s premier fashion event showcasing the latest collections from top Australian and international designers. Runway shows, installations, and industry events.',
        shortDescription: 'Premier fashion event with runway shows featuring top Australian designers.',
        category: 'Fashion',
        tags: ['fashion', 'runway', 'design', 'style', 'models'],
        imageUrl: 'https://live-production.wcms.abc-cdn.net.au/805a8d28e950a0b0226bc092450ca225?impolicy=wcms_crop_resize&cropH=3333&cropW=5000&xPos=0&yPos=0&width=862&height=575',
        sourceSite: 'Eventbrite',
        originalUrl: 'https://www.eventbrite.com.au/e/australian-fashion-week-tickets',
        status: ['new'],
        price: '$150 - $500',
        isFree: false,
        organizerName: 'Australian Fashion Week'
    },
    {
        title: 'Coogee to Bondi Coastal Walk Festival',
        dateTime: new Date('2026-04-05T08:00:00'),
        venue: 'Coogee to Bondi',
        address: 'Starting at Coogee Beach',
        city: 'Sydney',
        description: 'Scenic coastal walk festival celebrating Sydney\'s stunning beaches. Features art installations, food stalls, live music, and ocean activities along the 6km route.',
        shortDescription: 'Festival celebrating Sydney\'s coastal walk with art, food, and entertainment.',
        category: 'Sports',
        tags: ['coastal', 'walk', 'beach', 'outdoor', 'fitness'],
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        sourceSite: 'What\'s On Sydney',
        originalUrl: 'https://whatson.cityofsydney.nsw.gov.au/events/coastal-walk-festival',
        status: ['new'],
        isFree: true,
        organizerName: 'Waverley Council'
    },
    {
        title: 'Sydney International Art Fair',
        dateTime: new Date('2026-08-13T10:00:00'),
        endDateTime: new Date('2026-08-16T18:00:00'),
        venue: 'The Dome Sydney',
        address: '14-52 Darling Dr, Sydney Olympic Park NSW 2127',
        city: 'Sydney',
        description: 'Australia\'s largest contemporary art fair featuring galleries and artists from around the world. Discover and acquire contemporary art across all mediums.',
        shortDescription: 'Major contemporary art fair with galleries and artists from around the world.',
        category: 'Arts & Culture',
        tags: ['art', 'contemporary', 'gallery', 'exhibition', 'fair'],
        imageUrl: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800',
        sourceSite: 'Eventbrite',
        originalUrl: 'https://www.eventbrite.com.au/e/sydney-art-fair-tickets',
        status: ['new'],
        price: '$30 - $60',
        isFree: false,
        organizerName: 'Art Fairs Australia'
    },
    {
        title: 'Sydney Biennale 2026',
        dateTime: new Date('2026-03-12T10:00:00'),
        endDateTime: new Date('2026-06-08T18:00:00'),
        venue: 'Multiple Locations',
        address: 'Various Sydney Art Precincts',
        city: 'Sydney',
        description: 'Asia-Pacific\'s most significant international contemporary art event. Features works by leading artists from Australia and around the world across multiple venues.',
        shortDescription: 'Major international contemporary art event featuring global artists across Sydney.',
        category: 'Arts & Culture',
        tags: ['art', 'biennale', 'contemporary', 'exhibition', 'international'],
        imageUrl: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800',
        sourceSite: 'Sydney.com',
        originalUrl: 'https://www.sydney.com/events/biennale-of-sydney',
        status: ['new'],
        isFree: true,
        organizerName: 'Biennale of Sydney'
    },
    {
        title: 'Sydney Craft Beer Week',
        dateTime: new Date('2026-10-23T17:00:00'),
        endDateTime: new Date('2026-10-31T23:00:00'),
        venue: 'Various Pubs & Breweries',
        address: 'Sydney CBD and Inner West',
        city: 'Sydney',
        description: 'Celebrate craft beer culture with tastings, tap takeovers, brewery tours, and special releases from Sydney\'s best craft breweries and pubs.',
        shortDescription: 'Week-long celebration of craft beer with tastings, tours, and special releases.',
        category: 'Food & Drink',
        tags: ['beer', 'craft-beer', 'brewery', 'tasting', 'pub'],
        imageUrl: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800',
        sourceSite: 'Eventbrite',
        originalUrl: 'https://www.eventbrite.com.au/e/sydney-craft-beer-week-tickets',
        status: ['new'],
        price: '$20 - $100',
        isFree: false,
        organizerName: 'Sydney Craft Beer Association'
    },
    {
        title: 'Lunar New Year Festival',
        dateTime: new Date('2026-02-06T10:00:00'),
        endDateTime: new Date('2026-02-22T22:00:00'),
        venue: 'Chinatown & The Rocks',
        address: 'Dixon St & George St, Sydney',
        city: 'Sydney',
        description: 'Celebrate the Year of the Horse with Sydney\'s vibrant Lunar New Year celebrations. Dragon boat races, street parades, lantern displays, and authentic Asian cuisine.',
        shortDescription: 'Vibrant celebration of Lunar New Year with parades, dragon boats, and festivities.',
        category: 'Festival',
        tags: ['lunar-new-year', 'chinese', 'festival', 'cultural', 'chinatown'],
        imageUrl: 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=800',
        sourceSite: 'What\'s On Sydney',
        originalUrl: 'https://whatson.cityofsydney.nsw.gov.au/events/lunar-new-year',
        status: ['new'],
        isFree: true,
        organizerName: 'City of Sydney'
    },
    {
        title: 'Sydney Jazz Festival',
        dateTime: new Date('2026-07-10T19:00:00'),
        endDateTime: new Date('2026-07-19T23:00:00'),
        venue: 'Sydney Opera House & Various Venues',
        address: 'Bennelong Point and CBD venues',
        city: 'Sydney',
        description: 'Australia\'s premier jazz festival featuring world-class international and local jazz artists. From bebop to fusion, experience the best in contemporary jazz.',
        shortDescription: 'Premier jazz festival with international and Australian artists across multiple venues.',
        category: 'Music',
        tags: ['jazz', 'music', 'festival', 'live-music', 'concert'],
        imageUrl: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800',
        sourceSite: 'Eventbrite',
        originalUrl: 'https://www.eventbrite.com.au/e/sydney-jazz-festival-tickets',
        status: ['new'],
        price: '$45 - $120',
        isFree: false,
        organizerName: 'Sydney Jazz Festival'
    },
    {
        title: 'Australia Day Celebrations - Darling Harbour',
        dateTime: new Date('2026-01-26T10:00:00'),
        venue: 'Darling Harbour',
        address: 'Darling Harbour, Sydney NSW 2000',
        city: 'Sydney',
        description: 'Celebrate Australia Day with a full day of free entertainment, live music, food stalls, and spectacular fireworks over Darling Harbour.',
        shortDescription: 'Free Australia Day celebrations with entertainment, music, and fireworks.',
        category: 'Festival',
        tags: ['australia-day', 'fireworks', 'family', 'free', 'celebration'],
        imageUrl: 'https://images.unsplash.com/photo-1529693662653-9d480530a697?w=800',
        sourceSite: 'Sydney.com',
        originalUrl: 'https://www.sydney.com/events/australia-day',
        status: ['new'],
        isFree: true,
        organizerName: 'City of Sydney'
    },
    {
        title: 'Sydney International Piano Competition',
        dateTime: new Date('2026-07-01T19:30:00'),
        endDateTime: new Date('2026-07-20T22:00:00'),
        venue: 'Sydney Town Hall',
        address: '483 George St, Sydney NSW 2000',
        city: 'Sydney',
        description: 'Watch the world\'s finest young pianists compete in one of classical music\'s most prestigious competitions. Recitals, semi-finals, and the grand final.',
        shortDescription: 'Prestigious international piano competition featuring world-class young pianists.',
        category: 'Music',
        tags: ['classical', 'piano', 'competition', 'music', 'recital'],
        imageUrl: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800',
        sourceSite: 'Eventbrite',
        originalUrl: 'https://www.eventbrite.com.au/e/sydney-piano-competition-tickets',
        status: ['new'],
        price: '$25 - $85',
        isFree: false,
        organizerName: 'Sydney International Piano Competition'
    }
];

const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing events (optional - comment out to keep existing)
        await Event.deleteMany({});
        console.log('🗑️  Cleared existing events');

        // Insert sample events
        const createdEvents = await Event.insertMany(sampleEvents);
        console.log(`✅ Seeded ${createdEvents.length} events successfully`);

        // Display summary
        const categories = await Event.distinct('category');
        console.log(`\n📊 Summary:`);
        console.log(`   Total Events: ${createdEvents.length}`);
        console.log(`   Categories: ${categories.join(', ')}`);

        const upcomingCount = await Event.countDocuments({ dateTime: { $gte: new Date() } });
        console.log(`   Upcoming Events: ${upcomingCount}`);

        console.log('\n✅ Database seeding complete!');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('👋 Database connection closed');
    }
};

// Run seeding
seedDatabase();

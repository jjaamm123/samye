const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./models/backend_tour'); 
const Adventure = require('./models/backend_adventure'); 

dotenv.config();

// ─── PRODUCTION KILL-SWITCH ──────────────────────────────────────────────────
// This guard MUST remain the first thing executed after dotenv loads.
// It ensures that no CI/CD pipeline, accidental `node seeder.js` in production,
// or automated deploy hook can ever wipe the live database.
if (process.env.NODE_ENV === 'production') {
    console.error('\n[41m[1m DANGER [0m DANGER: Seeder execution blocked in production environment.');
    console.error('[33m  Set NODE_ENV to "development" in your local .env to run the seeder.[0m\n');
    process.exit(1);
}

// --- TOUR DATA ---
const toursToSeed = [
    {
        title: "Pokhara-Ghandruk-ABC Trek",
        description: "Combine the scenic beauty of Pokhara with a deep trek into the Annapurna Conservation Area to Annapurna Base Camp.",
        destination: "Nepal",
        duration: 11,
        price: {
            amount: 1300,
            displayType: "starting_from"
        },
        localPrice: 170000,
        difficulty: "Moderate",
        highlights: [
            "Sunrise views of the Annapurna Massif from Poon Hill",
            "Immersive cultural stays in traditional Gurung villages",
            "Traverse diverse landscapes from subtropical forests to alpine glaciers"
        ],
        gallery: [
            "https://images.unsplash.com/photo-1544735716-392fe2449fee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1522199710521-72d69614c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        itinerary: [
            { day: 1, title: "Arrival in Pokhara", description: "Flight/Drive to Pokhara, lakeside relax" },
            { day: 2, title: "Trek to Ghandruk", description: "Drive to Nayapul, trek to Ghandruk village" },
            { day: 3, title: "Chhomrong Ascent", description: "Trek Ghandruk to Chhomrong" }
        ],
        heroImage: "https://images.unsplash.com/photo-1544735716-392fe2449fee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        cardImage: "https://images.unsplash.com/photo-1544735716-392fe2449fee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Safari - Wildlife Reserves Package",
        description: "Go on a thrilling adventure through the dense jungles of Chitwan or Bardia National Park to spot one-horned rhinos, tigers, and more.",
        destination: "Nepal",
        duration: 3,
        price: {
            amount: 550,
            displayType: "exact"
        },
        localPrice: 73000,
        difficulty: "Easy",
        highlights: [
            "Exclusive deep-jungle jeep safaris",
            "Guided canoe rides to spot marsh mugger crocodiles",
            "Luxury eco-lodge accommodations inside the reserve"
        ],
        gallery: [
            "https://images.unsplash.com/photo-1588614959060-4d144f28b207?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        itinerary: [
            { day: 1, title: "Jungle Arrival", description: "Arrival at national park, briefing, and sunset" },
            { day: 2, title: "Deep Safari", description: "Full day of canoe ride, jungle walk, and safari" },
            { day: 3, title: "Bird Watching", description: "Bird watching and departure" }
        ],
        heroImage: "https://images.unsplash.com/photo-1588614959060-4d144f28b207?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        cardImage: "https://images.unsplash.com/photo-1588614959060-4d144f28b207?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Everest Base Camp Luxury Expedition",
        description: "The classic, legendary trek through the Khumbu Valley to the base of the world's highest peak, tailored for absolute luxury.",
        destination: "Nepal",
        duration: 14,
        price: {
            amount: 4500,
            displayType: "por" 
        },
        localPrice: 200000,
        difficulty: "Hard",
        highlights: [
            "Helicopter return from Kala Patthar for unparalleled Everest views",
            "Five-star luxury lodge accommodations in Namche Bazaar",
            "Private Sherpa guide and personalized high-altitude Porter team"
        ],
        gallery: [
            "https://images.unsplash.com/photo-1544735716-392fe2449fee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        itinerary: [
            { day: 1, title: "Kathmandu Briefing", description: "Arrival in Kathmandu & VIP Briefing" },
            { day: 2, title: "Flight to Lukla", description: "Thrilling flight to Lukla and trek to Phakding" },
            { day: 3, title: "Namche Bazaar", description: "Trek to Namche Bazaar" }
        ],
        heroImage: "https://images.unsplash.com/photo-1544735716-392fe2449fee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        cardImage: "https://images.unsplash.com/photo-1544735716-392fe2449fee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
];

// --- ADVENTURE SPORTS DATA ---
const adventuresToSeed = [
    {
        title: "Pokhara Paragliding",
        description: "Soar above Phewa Lake with breathtaking views of the Annapurna mountain range in one of the world's premier paragliding spots.",
        destination: "Nepal",
        location: "Pokhara", 
        sportType: "Paragliding",
        duration: 1,
        price: {
            amount: 95,
            displayType: "exact"
        },
        localPrice: 12500,
        difficulty: "Moderate",
        highlights: [
            "Tandem flight with world-class certified pilots",
            "Panoramic aerial views of the Annapurna range",
            "In-flight photo and video package included"
        ],
        gallery: [
            "https://images.unsplash.com/photo-1528650390623-01bd9bfa881b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        itinerary: [
            { day: 1, title: "Flight Day", description: "Transfer to Sarangkot, safety briefing, 30-min tandem flight, return to Pokhara." }
        ],
        heroImage: "https://images.unsplash.com/photo-1528650390623-01bd9bfa881b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        cardImage: "https://images.unsplash.com/photo-1528650390623-01bd9bfa881b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
];

// --- EXECUTION FUNCTION ---
const seedDatabase = async () => {
    try {
        // 1. Connect to Database
        await mongoose.connect(process.env.MONGO_URI);
        const env = process.env.NODE_ENV || 'development';
        console.log(`\n[32m✔[0m MongoDB Connected in [[36m${env}[0m] mode.`);
        console.log('[33m⚠[0m  Seeder is about to WIPE and RESEED Tours and Adventures.\n');

        // 2. Wipe old incompatible data
        await Tour.deleteMany(); 
        await Adventure.deleteMany();
        console.log("Old tours and adventures cleared out");

        // 3. Inject new data
        await Tour.insertMany(toursToSeed); 
        await Adventure.insertMany(adventuresToSeed); 
        console.log("New tours and adventures successfully injected!");

        // 4. Exit successfully
        process.exit(); 
    } catch (error) {
        console.error("Seeding Error:", error);
        process.exit(1);
    }
};

// Initiate the script
seedDatabase();
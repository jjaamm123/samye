const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./models/tour'); 

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Database connected for seeding..."))
    .catch((error) => {
        console.error("Connection failed:", error.message);
        process.exit(1);
    });

const toursToSeed = [
    {
        title: "Pokhara-Ghandruk-ABC Trek",
        description: "Combine the scenic beauty of Pokhara with a deep trek into the Annapurna Conservation Area to Annapurna Base Camp.",
        destination: "Nepal",
        duration: 11,
        price: 1300,
        difficulty: "Moderate",
        itinerary: [
            { day: 1, activity: "Flight/Drive to Pokhara, lakeside relax" },
            { day: 2, activity: "Drive to Nayapul, trek to Ghandruk village" },
            { day: 3, activity: "Trek Ghandruk to Chhomrong" }
            // Add more day entries as needed
        ],
        featuredImage: "/images/abc.jpg"
    },
    {
        title: "Safari - Wildlife Reserves Package",
        description: "Go on a thrilling adventure through the dense jungles of Chitwan or Bardia National Park to spot one-horned rhinos, tigers, and more.",
        destination: "Nepal",
        duration: 3,
        price: 550,
        difficulty: "Easy",
        itinerary: [
            { day: 1, activity: "Arrival at national park, briefing, and sunset" },
            { day: 2, activity: "Full day of canoe ride, jungle walk, and safari" },
            { day: 3, activity: "Bird watching and departure" }
        ],
        featuredImage: "/images/safari.jpg"
    },
    {
        title: "Kathmandu Valley Heritage Tour",
        description: "Explore the ancient, culturally rich cities of Kathmandu, Bhaktapur, and Patan, visiting key UNESCO World Heritage sites.",
        destination: "Nepal",
        duration: 4,
        price: 600,
        difficulty: "Easy",
        itinerary: [
            { day: 1, activity: "Arrival in Kathmandu, check-in" },
            { day: 2, activity: "Full day tour: Durbar Square & Swayambhunath" },
            { day: 3, activity: "Visit Pashupatinath and Boudhanath Stupa" },
            { day: 4, activity: "Drive to Bhaktapur Durbar Square and return" }
        ],
        featuredImage: "/images/kathmandu.jpg"
    },
    {
        title: "Everest Base Camp Trek",
        description: "The classic, legendary trek through the Khumbu Valley to the base of the world's highest peak.",
        destination: "Nepal",
        duration: 14,
        price: 1500,
        difficulty: "Hard",
        itinerary: [
            { day: 1, activity: "Arrival in Kathmandu & Briefing" },
            { day: 2, activity: "Thrilling flight to Lukla and trek to Phakding" },
            { day: 3, activity: "Trek to Namche Bazaar" }
        ],
        featuredImage: "/images/everest.jpg"
    },

    {
        title: "Central Tibet and Mt. Everest",
        description: "A cultural and scenic tour exploring key sites including the famous Stupa and iconic views of Mt. Everest from the Tibetan side.",
        destination: "Tibet",
        duration: 8,
        price: 1600,
        difficulty: "Moderate",
        itinerary: [
            { day: 1, activity: "Arrival in Lhasa, welcome briefing" },
            { day: 2, activity: "Full day tour: Jokhang Temple and Potala Palace" },
            { day: 3, activity: "Visit monasteries & acclimatize" }
        ],
        featuredImage: "/images/central_tibet.jpg"
    },
    {
        title: "Tibet Shishapangma Base Camp",
        description: "Trek through remote Tibetan landscapes and establish base camp in a wide, dry mountain plain near Shishapangma.",
        destination: "Tibet",
        duration: 10,
        price: 1900,
        difficulty: "Extreme",
        itinerary: [
            { day: 1, activity: "Arrival in Lhasa, welcome briefing" },
            { day: 2, activity: "Acclimatization, Potala Palace visit" },
            { day: 3, activity: "Begin trek to high altitude camp" }
        ],
        featuredImage: "/images/shishapangma.jpg"
    },
    {
        title: "Lhasa Tour",
        description: "Focus on the spiritual heart of Tibet, exploring the magnificent Potala Palace and other ancient monasteries in Lhasa.",
        destination: "Tibet",
        duration: 5,
        price: 1100,
        difficulty: "Easy",
        itinerary: [
            { day: 1, activity: "Arrival in Lhasa, acclimatization" },
            { day: 2, activity: "Tour of Potala Palace" },
            { day: 3, activity: "Visit Jokhang Temple and Barkhor street" },
            { day: 4, activity: "Visit Sera and Drepung Monasteries" },
            { day: 5, activity: "Departure" }
        ],
        featuredImage: "/images/lhasa.jpg"
    },

    {
        title: "Darjeeling and Sikkim Tour",
        description: "Traverse the rolling terraced green tea gardens of Darjeeling with stunning views of distant snow-capped mountains.",
        destination: "India",
        duration: 6,
        price: 850,
        difficulty: "Easy",
        itinerary: [
            { day: 1, activity: "Arrival at Bagdogra airport, transfer to Darjeeling" },
            { day: 2, activity: "Visit tea gardens and view Himalayan peak sunset" },
            { day: 3, activity: "Explore monasteries & Tiger Hill sunrise" }
        ],
        featuredImage: "/images/darjeeling.jpg"
    },
    {
        title: "Golden Triangle Tour",
        description: "Experience the ultimate cultural circuit: visit the historical landmarks of Delhi, Agra (Taj Mahal), and Jaipur.",
        destination: "India",
        duration: 7,
        price: 780,
        difficulty: "Easy",
        itinerary: [
            { day: 1, activity: "Arrival in Delhi, pick-up" },
            { day: 2, activity: "Old and New Delhi sightseeing" },
            { day: 3, activity: "Drive to Agra, sunset at Taj Mahal" }
        ],
        featuredImage: "/images/golden_triangle.jpg"
    }
];

const seedDatabase = async () => {
    try {
        await Tour.deleteMany(); 
        console.log("Old tours cleared out");

        await Tour.insertMany(toursToSeed); 
        console.log("New tours successfully injected");

        process.exit(); 
    } catch (error) {
        console.error("Seeding Error:", error);
        process.exit(1);
    }
};

seedDatabase();
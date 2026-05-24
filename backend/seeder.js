const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./models/backend_tour'); 
const Adventure = require('./models/backend_adventure'); 

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Database connected for seeding..."))
    .catch((error) => {
        console.error("Connection failed:", error.message);
        process.exit(1);
    });

// --- TOUR DATA ---
const toursToSeed = [
    {
        title: "Pokhara-Ghandruk-ABC Trek",
        description: "Combine the scenic beauty of Pokhara with a deep trek into the Annapurna Conservation Area to Annapurna Base Camp.",
        destination: "Nepal",
        duration: 11,
        price: 1300,
        localPrice: 170000,
        difficulty: "Moderate",
        itinerary: [
            { day: 1, title: "Arrival in Pokhara", description: "Flight/Drive to Pokhara, lakeside relax" },
            { day: 2, title: "Trek to Ghandruk", description: "Drive to Nayapul, trek to Ghandruk village" },
            { day: 3, title: "Chhomrong Ascent", description: "Trek Ghandruk to Chhomrong" }
        ],
        featuredImage: "https://images.unsplash.com/photo-1544735716-392fe2449fee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Safari - Wildlife Reserves Package",
        description: "Go on a thrilling adventure through the dense jungles of Chitwan or Bardia National Park to spot one-horned rhinos, tigers, and more.",
        destination: "Nepal",
        duration: 3,
        price: 550,
        localPrice: 73000,
        difficulty: "Easy",
        itinerary: [
            { day: 1, title: "Jungle Arrival", description: "Arrival at national park, briefing, and sunset" },
            { day: 2, title: "Deep Safari", description: "Full day of canoe ride, jungle walk, and safari" },
            { day: 3, title: "Bird Watching", description: "Bird watching and departure" }
        ],
        featuredImage: "https://images.unsplash.com/photo-1588614959060-4d144f28b207?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Kathmandu Valley Heritage Tour",
        description: "Explore the ancient, culturally rich cities of Kathmandu, Bhaktapur, and Patan, visiting key UNESCO World Heritage sites.",
        destination: "Nepal",
        duration: 4,
        price: 600,
        localPrice: 80000,
        difficulty: "Easy",
        itinerary: [
            { day: 1, title: "Welcome to Nepal", description: "Arrival in Kathmandu, check-in" },
            { day: 2, title: "Ancient Temples", description: "Full day tour: Durbar Square & Swayambhunath" },
            { day: 3, title: "Spiritual Sites", description: "Visit Pashupatinath and Boudhanath Stupa" },
            { day: 4, title: "Bhaktapur Excursion", description: "Drive to Bhaktapur Durbar Square and return" }
        ],
        featuredImage: "https://images.unsplash.com/photo-1585016495481-91613a3ab1bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Everest Base Camp Trek",
        description: "The classic, legendary trek through the Khumbu Valley to the base of the world's highest peak.",
        destination: "Nepal",
        duration: 14,
        price: 1500,
        localPrice: 200000,
        difficulty: "Hard",
        itinerary: [
            { day: 1, title: "Kathmandu Briefing", description: "Arrival in Kathmandu & Briefing" },
            { day: 2, title: "Flight to Lukla", description: "Thrilling flight to Lukla and trek to Phakding" },
            { day: 3, title: "Namche Bazaar", description: "Trek to Namche Bazaar" }
        ],
        featuredImage: "https://images.unsplash.com/photo-1544735716-392fe2449fee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Central Tibet and Mt. Everest",
        description: "A cultural and scenic tour exploring key sites including the famous Stupa and iconic views of Mt. Everest from the Tibetan side.",
        destination: "Tibet",
        duration: 8,
        price: 1600,
        localPrice: 215000,
        difficulty: "Moderate",
        itinerary: [
            { day: 1, title: "Lhasa Arrival", description: "Arrival in Lhasa, welcome briefing" },
            { day: 2, title: "Potala Palace", description: "Full day tour: Jokhang Temple and Potala Palace" },
            { day: 3, title: "Acclimatization", description: "Visit monasteries & acclimatize" }
        ],
        featuredImage: "https://images.unsplash.com/photo-1533604100062-378f8444a56c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Darjeeling and Sikkim Tour",
        description: "Traverse the rolling terraced green tea gardens of Darjeeling with stunning views of distant snow-capped mountains.",
        destination: "India",
        duration: 6,
        price: 850,
        localPrice: 113000,
        difficulty: "Easy",
        itinerary: [
            { day: 1, title: "Arrival", description: "Arrival at Bagdogra airport, transfer to Darjeeling" },
            { day: 2, title: "Tea Gardens", description: "Visit tea gardens and view Himalayan peak sunset" },
            { day: 3, title: "Tiger Hill", description: "Explore monasteries & Tiger Hill sunrise" }
        ],
        featuredImage: "https://images.unsplash.com/photo-1544537380-085e340b080d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
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
        price: 95,
        localPrice: 12500,
        difficulty: "Moderate",
        itinerary: [
            { day: 1, title: "Flight Day", description: "Transfer to Sarangkot, safety briefing, 30-min tandem flight, return to Pokhara." }
        ],
        featuredImage: "https://images.unsplash.com/photo-1528650390623-01bd9bfa881b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Bhote Koshi River Rafting",
        description: "Experience the ultimate adrenaline rush navigating steep, technical rapids on this famous white-water rafting run.",
        destination: "Nepal",
        location: "Bhote Koshi",
        sportType: "Rafting",
        duration: 2,
        price: 150,
        localPrice: 19800,
        difficulty: "Hard",
        itinerary: [
            { day: 1, title: "Drive and Camp", description: "Drive from Kathmandu to the river, evening briefing and riverside camping." },
            { day: 2, title: "The Rapids", description: "Full day of intense Class III and IV rapids, followed by a drive back to the city." }
        ],
        featuredImage: "https://images.unsplash.com/photo-1534066060161-59914757e7eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "The Last Resort Bungee Jump",
        description: "Take a leap of faith from a suspension bridge 160 meters above the wild Bhote Koshi River.",
        destination: "Nepal",
        location: "Sindhupalchok",
        sportType: "Bungee Jumping",
        duration: 1,
        price: 120,
        localPrice: 15800,
        difficulty: "Extreme",
        itinerary: [
            { day: 1, title: "Jump Day", description: "Early drive to the Tibet border, safety prep, the jump, and return transfer." }
        ],
        featuredImage: "https://images.unsplash.com/photo-1522031109968-07d2f9d5fc9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
];

const seedDatabase = async () => {
    try {
        await Tour.deleteMany(); 
        await Adventure.deleteMany();
        console.log("Old tours and adventures cleared out");

        await Tour.insertMany(toursToSeed); 
        await Adventure.insertMany(adventuresToSeed); 
        console.log("New tours and adventures successfully injected");

        process.exit(); 
    } catch (error) {
        console.error("Seeding Error:", error);
        process.exit(1);
    }
};

seedDatabase();
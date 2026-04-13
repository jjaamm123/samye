const adventureSchema = new mongoose.Schema({
    title: String,
    sportType: String,     
    location: String,       
    duration: String,       
    intensity: String,      
    price: Number,
    minAge: String,         
    description: String,
    featuredImage: String,
    gallery: [String],
    included: [String],     
    safetyNotes: String,
    itinerary: [{ day: Number, time: String, activity: String }]
});
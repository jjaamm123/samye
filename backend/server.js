const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Tour = require('./models/tour'); 

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch((error) => console.error("MongoDB connection failed:", error.message));


app.get('/api/test', (req, res) => {
    res.json({ message: "running" });
});

app.get('/api/tours', async (req, res) => {
    try {
        const allTours = await Tour.find(); 
        
        res.status(200).json(allTours); 
    } catch (error) {
        console.error("Error fetching tours:", error);
        res.status(500).json({ message: "Server Error: Could not fetch tours." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
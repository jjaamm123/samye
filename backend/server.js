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

app.get('/api/tours/:id', async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id); 
        
        if (!tour) {
            return res.status(404).json({ message: "Tour not found." });
        }
        
        res.status(200).json(tour); 
    } catch (error) {
        console.error("Error fetching single tour:", error);
        res.status(500).json({ message: "Server Error: Could not fetch the tour." });
    }
});

app.post('/api/tours', async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json(newTour); 
    } catch (error) {
        console.error("Error creating tour:", error);
        res.status(400).json({ message: "Failed to create tour." });
    }
});

app.delete('/api/tours/:id', async (req, res) => {
    try {
        const deletedTour = await Tour.findByIdAndDelete(req.params.id);
        if (!deletedTour) {
            return res.status(404).json({ message: "Tour not found." });
        }
        res.status(200).json({ message: "Tour deleted successfully." });
    } catch (error) {
        console.error("Error deleting tour:", error);
        res.status(500).json({ message: "Failed to delete tour." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});


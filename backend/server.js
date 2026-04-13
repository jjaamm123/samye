const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Tour = require('./models/tour'); 
const Booking = require('./models/booking'); 
const Adventure = require('./models/adventure'); 

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
        if (!tour) return res.status(404).json({ message: "Tour not found." });
        res.status(200).json(tour); 
    } catch (error) {
        console.error("Error fetching single tour:", error);
        res.status(500).json({ message: "Server Error: Could not fetch the tour." });
    }
});

app.put('/api/tours/:id', async (req, res) => {
    try {
        const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTour) return res.status(404).json({ message: "Tour not found." });
        res.status(200).json(updatedTour);
    } catch (error) {
        console.error("Error updating tour:", error);
        res.status(500).json({ message: "Failed to update tour." });
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
        if (!deletedTour) return res.status(404).json({ message: "Tour not found." });
        res.status(200).json({ message: "Tour deleted successfully." });
    } catch (error) {
        console.error("Error deleting tour:", error);
        res.status(500).json({ message: "Failed to delete tour." });
    }
});

app.get('/api/adventures', async (req, res) => {
    try {
        const adventures = await Adventure.find();
        res.status(200).json(adventures);
    } catch (error) {
        console.error("Error fetching adventures:", error);
        res.status(500).json({ message: "Server Error: Could not fetch adventures." });
    }
});

app.get('/api/adventures/:id', async (req, res) => {
    try {
        const adventure = await Adventure.findById(req.params.id);
        if (!adventure) return res.status(404).json({ message: "Adventure not found." });
        res.status(200).json(adventure);
    } catch (error) {
        console.error("Error fetching single adventure:", error);
        res.status(500).json({ message: "Server Error: Could not fetch the adventure." });
    }
});

app.post('/api/bookings', async (req, res) => {
    try {
        const newBooking = await Booking.create(req.body);
        res.status(201).json({ message: "Booking request received successfully!", booking: newBooking });
    } catch (error) {
        console.error("Error saving booking:", error);
        res.status(500).json({ message: "Failed to process booking request." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
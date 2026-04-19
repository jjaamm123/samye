const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Tour = require('./models/backend_tour'); 
const Booking = require('./models/booking'); 
const Adventure = require('./models/backend_adventure'); 
const Inquiry = require('./models/backend_inquiry');
const multer = require('multer');
const path = require('path');
const fs = require('fs')
const app = express();

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// ─── ADVENTURES ────────────────────────────────────────────────────────
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

app.put('/api/adventures/:id', async (req, res) => {
    try {
        const updatedAdv = await Adventure.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedAdv) return res.status(404).json({ message: "Adventure not found." });
        res.status(200).json(updatedAdv);
    } catch (error) {
        console.error("Error updating adventure:", error);
        res.status(500).json({ message: "Failed to update adventure." });
    }
});

app.delete('/api/adventures/:id', async (req, res) => {
    try {
        const deletedAdv = await Adventure.findByIdAndDelete(req.params.id);
        if (!deletedAdv) return res.status(404).json({ message: "Adventure not found." });
        res.status(200).json({ message: "Adventure deleted successfully." });
    } catch (error) {
        console.error("Error deleting adventure:", error);
        res.status(500).json({ message: "Failed to delete adventure." });
    }
});

app.post('/api/adventures', async (req, res) => {
    try {
        const newAdv = await Adventure.create(req.body);
        res.status(201).json(newAdv); 
    } catch (error) {
        console.error("Error creating adventure:", error);
        res.status(400).json({ message: "Failed to create adventure." });
    }
});


// ─── INQUIRIES ─────────────────────────────────────────────────────────
// GET all inquiries
app.get('/api/inquiries', async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        res.status(200).json(inquiries);
    } catch (error) {
        console.error("Error fetching inquiries:", error);
        res.status(500).json({ message: "Failed to fetch inquiries." });
    }
});

// POST new inquiry (from Contact form + detail page forms)
app.post('/api/inquiries', async (req, res) => {
    try {
        const inq = new Inquiry(req.body);
        await inq.save();
        res.status(201).json(inq);
    } catch (error) {
        console.error("Error saving inquiry:", error);
        res.status(500).json({ message: "Failed to process inquiry." });
    }
});

// PATCH status update (admin dashboard)
app.patch('/api/inquiries/:id', async (req, res) => {
    try {
        const inq = await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!inq) return res.status(404).json({ message: "Inquiry not found." });
        res.json(inq);
    } catch (error) {
        console.error("Error updating inquiry:", error);
        res.status(500).json({ message: "Failed to update inquiry status." });
    }
});

app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        
        const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        res.status(200).json({ imageUrl });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Image upload failed." });
    }
});

// ─── SERVER INIT ───────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
const express    = require('express');
const cors       = require('cors');
const mongoose   = require('mongoose');
require('dotenv').config();

const Gallery    = require('./models/backend_gallery');
const Tour       = require('./models/backend_tour');
const Booking    = require('./models/booking');
const Adventure  = require('./models/backend_adventure');
const Inquiry    = require('./models/backend_inquiry');
const Lead       = require('./models/Lead');
const upload     = require('./middleware/upload');
const authRoutes = require('./routes/auth');
const { protect } = require('./middleware/authMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        const env = process.env.NODE_ENV || 'development';
        console.log(`MongoDB Connected in [${env}] mode.`);
    })
    .catch((error) => console.error('MongoDB connection failed:', error.message));

// ─── PUBLIC ────────────────────────────────────────────────────────────────
app.get('/api/test', (req, res) => res.json({ message: "running" }));

// Auth routes (login / register — all public)
app.use('/api/auth', authRoutes);

// ─── TOURS (GET = public, mutating = protected) ────────────────────────────
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

app.post('/api/tours', protect, upload.fields([
    { name: 'cardImage',    maxCount: 1  },
    { name: 'heroImage',    maxCount: 1  },
    { name: 'galleryImages', maxCount: 10 }
]), async (req, res) => {
    try {
        const tourData = { ...req.body };
        if (req.files) {
            if (req.files['cardImage'])     tourData.cardImage     = req.files['cardImage'][0].path;
            if (req.files['heroImage'])     tourData.heroImage     = req.files['heroImage'][0].path;
            if (req.files['galleryImages']) tourData.galleryImages = req.files['galleryImages'].map(f => f.path);
        }
        const newTour = await Tour.create(tourData);
        res.status(201).json(newTour);
    } catch (error) {
        console.error("Error creating tour:", error);
        res.status(400).json({ message: "Failed to create tour." });
    }
});

app.put('/api/tours/:id', protect, upload.fields([
    { name: 'cardImage',    maxCount: 1  },
    { name: 'heroImage',    maxCount: 1  },
    { name: 'galleryImages', maxCount: 10 }
]), async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.files) {
            if (req.files['cardImage'])     updateData.cardImage     = req.files['cardImage'][0].path;
            if (req.files['heroImage'])     updateData.heroImage     = req.files['heroImage'][0].path;
            if (req.files['galleryImages']) updateData.galleryImages = req.files['galleryImages'].map(f => f.path);
        }
        const updatedTour = await Tour.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedTour) return res.status(404).json({ message: "Tour not found." });
        res.status(200).json(updatedTour);
    } catch (error) {
        console.error("Error updating tour:", error);
        res.status(500).json({ message: "Failed to update tour." });
    }
});

app.delete('/api/tours/:id', protect, async (req, res) => {
    try {
        const deletedTour = await Tour.findByIdAndDelete(req.params.id);
        if (!deletedTour) return res.status(404).json({ message: "Tour not found." });
        res.status(200).json({ message: "Tour deleted successfully." });
    } catch (error) {
        console.error("Error deleting tour:", error);
        res.status(500).json({ message: "Failed to delete tour." });
    }
});

// ─── ADVENTURES (GET = public, mutating = protected) ───────────────────────
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

app.post('/api/adventures', protect, upload.fields([
    { name: 'cardImage',    maxCount: 1  },
    { name: 'heroImage',    maxCount: 1  },
    { name: 'galleryImages', maxCount: 10 }
]), async (req, res) => {
    try {
        const advData = { ...req.body };
        if (req.files) {
            if (req.files['cardImage'])     advData.cardImage     = req.files['cardImage'][0].path;
            if (req.files['heroImage'])     advData.heroImage     = req.files['heroImage'][0].path;
            if (req.files['galleryImages']) advData.galleryImages = req.files['galleryImages'].map(f => f.path);
        }
        const newAdv = await Adventure.create(advData);
        res.status(201).json(newAdv);
    } catch (error) {
        console.error("Error creating adventure:", error);
        res.status(400).json({ message: "Failed to create adventure." });
    }
});

app.put('/api/adventures/:id', protect, upload.fields([
    { name: 'cardImage',    maxCount: 1  },
    { name: 'heroImage',    maxCount: 1  },
    { name: 'galleryImages', maxCount: 10 }
]), async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.files) {
            if (req.files['cardImage'])     updateData.cardImage     = req.files['cardImage'][0].path;
            if (req.files['heroImage'])     updateData.heroImage     = req.files['heroImage'][0].path;
            if (req.files['galleryImages']) updateData.galleryImages = req.files['galleryImages'].map(f => f.path);
        }
        const updatedAdv = await Adventure.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedAdv) return res.status(404).json({ message: "Adventure not found." });
        res.status(200).json(updatedAdv);
    } catch (error) {
        console.error("Error updating adventure:", error);
        res.status(500).json({ message: "Failed to update adventure." });
    }
});

app.delete('/api/adventures/:id', protect, async (req, res) => {
    try {
        const deletedAdv = await Adventure.findByIdAndDelete(req.params.id);
        if (!deletedAdv) return res.status(404).json({ message: "Adventure not found." });
        res.status(200).json({ message: "Adventure deleted successfully." });
    } catch (error) {
        console.error("Error deleting adventure:", error);
        res.status(500).json({ message: "Failed to delete adventure." });
    }
});

// ─── INQUIRIES ──────────────────────────────────────────────────────────────
// POST /api/inquiries is PUBLIC — customers submit contact forms unauthenticated
app.get('/api/inquiries', protect, async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        res.status(200).json(inquiries);
    } catch (error) {
        console.error("Error fetching inquiries:", error);
        res.status(500).json({ message: "Failed to fetch inquiries." });
    }
});

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

app.patch('/api/inquiries/:id', protect, async (req, res) => {
    try {
        const inq = await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!inq) return res.status(404).json({ message: "Inquiry not found." });
        res.json(inq);
    } catch (error) {
        console.error("Error updating inquiry:", error);
        res.status(500).json({ message: "Failed to update inquiry status." });
    }
});

// ─── LEADS (POST = public, GET = protected) ────────────────────────────────
// Captures itinerary-download lead submissions from the gated modal.
app.get('/api/leads', protect, async (req, res) => {
    try {
        const leads = await Lead.find()
            .populate('tourId', 'title')
            .sort({ createdAt: -1 });
        res.status(200).json(leads);
    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).json({ message: 'Failed to fetch leads.' });
    }
});

app.post('/api/leads', async (req, res) => {
    try {
        const { name, email, whatsapp, tourId, tourTitle } = req.body;
        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required.' });
        }
        const lead = await Lead.create({ name, email, whatsapp, tourId, tourTitle });
        res.status(201).json(lead);
    } catch (error) {
        console.error('Error saving lead:', error);
        res.status(500).json({ message: 'Failed to save lead.' });
    }
});

// ─── UPLOAD (protected — only admin should push images) ────────────────────
app.post('/api/upload', protect, upload.single('image'), (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        res.status(200).json({ imageUrl: req.file.path });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Image upload failed." });
    }
});

// ─── GALLERY (GET = public, mutating = protected) ──────────────────────────
app.get('/api/gallery', async (req, res) => {
    try {
        const gallery = await Gallery.find().sort({ createdAt: -1 });
        res.status(200).json(gallery);
    } catch (error) {
        console.error("Error fetching gallery:", error);
        res.status(500).json({ message: "Failed to fetch gallery." });
    }
});

app.post('/api/gallery', protect, async (req, res) => {
    try {
        const newGallery = await Gallery.create(req.body);
        res.status(201).json(newGallery);
    } catch (error) {
        console.error("Error saving gallery item:", error);
        res.status(400).json({ message: "Failed to save gallery item." });
    }
});

app.delete('/api/gallery/:id', protect, async (req, res) => {
    try {
        await Gallery.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Gallery item deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete gallery item." });
    }
});

// ─── SERVER INIT ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
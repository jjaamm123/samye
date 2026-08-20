# Samye Travels

A full-stack travel and expedition platform built on the MERN stack. Samye Travels offers a bespoke, editorial-style storefront for exploring custom itineraries, guided tours, and extreme adventures across Nepal, Tibet, and India, paired with a robust administrative dashboard for content management.

---

##  Overview

The application features a clean, high-contrast, image-heavy layout designed to inspire travelers. It includes a custom itinerary builder, a highly faceted filtering system for discovering packages, and an admin interface to manage the complex taxonomy of travel styles, sub-themes, and seasonal availability.

---

## Architecture & Tech Stack

**Frontend:**
- **React (Vite)**: Fast, modern SPA framework.
- **React Router DOM**: Client-side routing.
- **Axios**: HTTP client for API communication.
- **Styling**: Custom CSS focused on an editorial, lookbook-style aesthetic.

**Backend:**
- **Node.js & Express**: RESTful API server.
- **MongoDB & Mongoose**: NoSQL database for flexible array-based taxonomy schemas.
- **Cloudinary**: Cloud storage for handling high-quality image uploads with on-the-fly optimization (`fetch_format: 'auto'`, `quality: 'auto'`).
- **Multer**: Middleware for handling multipart/form-data.

---

## Key Features

### 1. Dynamic Package Filtering
Faceted sidebar and URL query parameter-based filtering that effortlessly handles array-based category tags. Users can instantly filter by:
- **Destinations**: Nepal, Tibet, India
- **Experience Themes**: Adventure & Active, Nature & Discovery, Culture & Lifestyle, Leisure & Scenic
- **Sub-Themes**: Walking and Hiking Vacations, Wildlife Vacations, Foodie Vacations, etc.
- **Travel Styles**: Family, Group, Solo, Tailor-Made, etc.
- **Seasons & Difficulty Levels**

### 2. Custom Itinerary Builder ("Build My Trip")
An interactive "moodboard" where users can mix and match guided tours and extreme adventures into a single custom expedition. The builder dynamically calculates total trip durations and dynamically gauges the expedition's intensity.

### 3. Comprehensive Admin Dashboard
A secure portal for administrators to manage the platform's content without writing code:
- **Tours & Adventures CRUD**: Create and edit packages, including complex array-based taxonomy tags and granular pricing models.
- **Media Gallery Manager**: Directly upload and categorize localized images and videos to Cloudinary.
- **Multi-select Checkbox Arrays**: User-friendly multi-select inputs that perfectly map to MongoDB array schemas.

### 4. Advanced Cloudinary Integration
Images are piped directly into Cloudinary through the backend, dynamically enforcing maximum resolutions (1920px) while utilizing Cloudinary's intelligent compression algorithms to deliver modern WebP/AVIF formats directly to the user's browser, minimizing bandwidth usage.

---

## Repository Structure

```text
samye/
├── backend/               # Express API & database configuration
│   ├── config/            # DB connections and environment configs
│   ├── controllers/       # Route logic (Tours, Adventures, Auth, Media)
│   ├── middleware/        # Cloudinary & Multer upload handling
│   ├── models/            # Mongoose schemas (Tour, Adventure, Gallery)
│   ├── routes/            # Express router definitions
│   └── server.js          # Main entry point
└── frontend/              # React SPA (Vite)
    ├── src/
    │   ├── components/    # Reusable UI (Navbar, TourCard, PriceDisplay, VisualMoodboard)
    │   ├── pages/         # Route views (Home, Packages, CustomTour, AdminDashboard, etc.)
    │   └── App.jsx        # Routing configuration
    └── package.json       # Frontend dependencies and scripts
```

---

## Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/samye-travels.git
   cd samye-travels
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   PORT=5000
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
   Start the Vite development server:
   ```bash
   npm run dev
   ```

4. **View the App:**
   Open `http://localhost:5173` in your browser.
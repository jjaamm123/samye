# <font size="7">Samye Travels</font>
### <font size="4"><i>Full-Stack Travel Agency & Adventure Booking Platform</i></font>

---

## <font size="5">Overview</font>
This is a full-stack web application designed for a premium travel agency specializing in Himalayan expeditions across Nepal, Tibet, and India. The platform features an immersive customer portal paired with a secure, JWT-authenticated administrative dashboard for managing complex multi-day itineraries, extreme sports packages, user inquiries, and multimedia galleries.

---

## <font size="5">Live Links</font>
* **Storefront:** https://samye.vercel.app/
* **Backend API:** https://samye-c5nv.onrender.com

---

## <font size="5">Architecture & Code Map</font>
```text
SAMYE/
├── backend/               # Express API & database configuration
│   ├── middleware/        # JWT auth verification & Cloudinary upload logic
│   ├── models/            # Mongoose schemas (Admin, Tours, Adventures, Gallery)
│   ├── routes/            # API endpoints (auth.js, etc.)
│   └── server.js          # Main entry point
└── frontend/              # React SPA (Vite)
    ├── src/
    │   ├── components/    # Reusable UI (ProtectedRoute)
    │   ├── context/       # Global state management (CurrencyContext)
    │   ├── pages/         # TourDetails, AdventureDetails, Gallery, AdminDashboard
    │   └── App.jsx        # Core routing and layout configuration
    └── vercel.json        # Routing rules for production SPA deployment
 ```
## <font size="7">Technical Features</font>

### <font size="5">Frontend & Client-Side Logic</font>

#### <font size="5">Immersive UI & Animations</font>
Built with premium, brand-aligned color schemes, scroll-triggered staggered reveals, and clean native cursor enforcement to elevate the standard travel booking experience.

#### <font size="5">Interactive Media Gallery</font>
Features a segmented tab architecture (Scenic Views, Customer Moments, Videos) paired with a responsive, keyboard-navigable lightbox carousel for high-resolution asset viewing.

#### <font size="5">Contextual Booking Triggers</font>
Implements dynamic anchor scrolling that directs users to inquiry forms, automatically injecting contextual placeholders based on the currently viewed tour or extreme sport package.

---

### <font size="5">Admin Tools & Security</font>

#### <font size="5">JWT-Secured Dashboard</font>
Protected administrative routing utilizing `bcryptjs` password hashing and JSON Web Tokens to restrict unauthorized access to inventory and customer inquiry management.

#### <font size="5">Dynamic Itinerary Management</font>
Allows administrators to seamlessly append, edit, or remove individual phases and daily schedules within a complex multi-day package utilizing dynamic array subdocuments.

#### <font size="5">Pre-Publish Media Previews</font>
Utilizes client-side blob generation allowing admins to instantly preview selected Cloudinary image and video assets directly within the dashboard prior to executing database writes.

---

### <font size="5">Database & Asset Infrastructure</font>

#### <font size="5">Multi-Format Media Storage</font>
Integrated Cloudinary upload pipeline configured with automated resource type detection to seamlessly process, optimize, and serve both imagery and video formats (`.mp4`, `.mov`).

#### <font size="5">Relational Data Modeling</font>
Managed through tailored Mongoose schemas designed to sanitize incoming package data, splitting comma-separated strings into clean inclusion/exclusion arrays.

#### <font size="5">Multi-Currency Context</font>
Implements a global React context provider to toggle and format dynamic pricing arrays, displaying metrics in both standard USD and local Nepalese Rupees (NPR).

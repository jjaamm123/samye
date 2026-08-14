# <font size="7">Yeshi</font>
### <font size="4"><i>Full-Stack E-Commerce & Inventory Management Platform</i></font>

---

## <font size="5">Overview</font>
This is a full-stack web application designed for a high-fashion storefront, paired with an inventory manager built for an administrator. The project focuses on a clean, high-contrast, text-heavy layout inspired by editorial lookbooks.

---

## <font size="5">Live Links</font>
* **Storefront:** [yeshi-two.vercel.app](https://yeshi-two.vercel.app)
* **Backend API:** [yeshi-bg5i.onrender.com](https://yeshi-bg5i.onrender.com)

---

## <font size="5">Architecture & Code Map</font>
```text
yeshi/
├── backend/               # Express API & database configuration
│   ├── config/db.js       # Mongoose connection logic[cite: 1]
│   ├── seed.mjs           # Populates Atlas with baseline products
│   └── server.js          # Main entry point
└── frontend/              # React SPA (Vite + Tailwind v4)
    ├── src/
    │   ├── components/    # Layout pieces (Footer, ScrollToTop)
    │   ├── pages/
    │   │   ├── admin/     # ProductManager.jsx (Inventory CRUD)
    │   │   └── storefront/# Product catalog, CustomerCare.jsx
    │   └── App.jsx        # Routing configuration
    └── vercel.json        # Routing rules for production SPA

## Technical Features

### Frontend & Client-Side Logic

#### Editorial Typography
Built using a high-contrast layout utilizing structural borders and varying typographic weights.

#### SPA Route Fixing
Includes a `vercel.json` configuration file to ensure manual URL refreshes on nested paths (like `/admin`) map back to the root index.

#### Scroll Reset Utility
Integrated custom hook to automatically force pages back to the top coordinate upon route changes.

---

### Admin Tools & Variation Tracking

#### Dynamic Row Forms
Allows administrators to append or remove individual product variation rows (managing unique size, color, and specific stock metrics) simultaneously.

#### Image Management Pipeline
Supports staging up to five images per document, generating localized client-side blob URLs for review before triggering network payloads.

#### Localized Formatting
Implements automated formatting pipes to process numbers into Nepalese Rupees (NPR).

---

### Database & Asset Infrastructure

#### Data Modeling
Managed through Mongoose schemas to sanitize incoming variations into clean array subdocuments.

#### Cloud Storage
Integrated with Cloudinary API for offloading multi-image uploads from the host server.

#### Baseline Seeding
Includes a decoupled data script (`seed.mjs`) to cleanly clear and populate the cluster remotely.    
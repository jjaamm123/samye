// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Home             from './pages/Home';
import Packages         from './pages/Packages';
import TourDetails      from './pages/TourDetails';
import AdventureDetails from './pages/AdventureDetails';
import CustomTour       from './pages/CustomTour';
import About            from './pages/About';
import Gallery          from './pages/Gallery';
import Contact          from './pages/Contact';
import AdminDashboard   from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"               element={<Home />} />

        {/* Unified packages page — replaces /tours and /adventures */}
        <Route path="/packages"       element={<Packages />} />

        {/* Detail pages still use their own routes */}
        <Route path="/tour/:id"       element={<TourDetails />} />
        <Route path="/adventure/:id"  element={<AdventureDetails />} />

        <Route path="/custom-tour"    element={<CustomTour />} />
        <Route path="/about"          element={<About />} />
        <Route path="/gallery"        element={<Gallery />} />
        <Route path="/contact"        element={<Contact />} />
        <Route path="/admin"          element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
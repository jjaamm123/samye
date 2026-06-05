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
import AdminLogin       from './pages/AdminLogin';
import ProtectedRoute   from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"              element={<Home />} />
        <Route path="/packages"      element={<Packages />} />
        <Route path="/tour/:id"      element={<TourDetails />} />
        <Route path="/adventure/:id" element={<AdventureDetails />} />
        <Route path="/custom-tour"   element={<CustomTour />} />
        <Route path="/about"         element={<About />} />
        <Route path="/gallery"       element={<Gallery />} />
        <Route path="/contact"       element={<Contact />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
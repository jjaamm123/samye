// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
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
import Footer           from './components/Footer';
import ScrollToTop      from './components/ScrollToTop';

// ── Layout wraps all public pages with a Footer + Scroll-to-Top ───────────────
function PublicLayout() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const checkScrollTop = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', checkScrollTop, { passive: true });
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      <Outlet />
      <Footer />

      {/* ── Floating Scroll-to-Top Button ── */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`fixed bottom-8 right-8 z-50 p-3 bg-[#9c826b] hover:bg-[#856d57] text-white rounded-full shadow-lg transition-all duration-300 transform ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* ── Public routes — share Footer + Scroll-to-Top via PublicLayout ── */}
        <Route element={<PublicLayout />}>
          <Route path="/"              element={<Home />} />
          <Route path="/packages"      element={<Packages />} />
          <Route path="/tour/:id"       element={<TourDetails />} />
          <Route path="/tours/:id"      element={<TourDetails />} />
          <Route path="/adventure/:id"  element={<AdventureDetails />} />
          <Route path="/adventures/:id" element={<AdventureDetails />} />
          <Route path="/custom-tour"    element={<CustomTour />} />
          <Route path="/about"          element={<About />} />
          <Route path="/gallery"        element={<Gallery />} />
          <Route path="/contact"        element={<Contact />} />
        </Route>

        {/* ── Admin routes — intentionally outside PublicLayout ── */}
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